import { Router } from "express";
import prisma from "../prisma";
import { generateTID, generateSignature, generateQRCode } from "../utils/dtid";

const router = Router();

router.get("/tourists/unverified", async (req, res) => {
    try {
        const tourists = await prisma.tourist.findMany({
            where: { verified: false },
            include: {
                trips: true,
                emergencyContacts: true
            },
            orderBy: { createdAt: "desc" }
        });

        res.json({ count: tourists.length, tourists });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching unverified tourists" });
    }
});

/* =======================================================
   ADMIN APPROVES TOURIST → GENERATE DIGITAL ID + QR
========================================================= */
router.post("/tourist/:id/approve", async (req, res) => {
    const touristId = req.params.id;

    try {
        const tourist = await prisma.tourist.findUnique({
            where: { id: touristId },
            include: { trips: true }
        });

        if (!tourist) return res.status(404).json({ message: "Tourist not found" });

        if (tourist.trips.length === 0)
            return res.status(400).json({ message: "Tourist has no trips. Cannot generate ID." });

        const latestTrip = tourist.trips.reduce((a, b) =>
            a.endDate > b.endDate ? a : b
        );

        const tid = generateTID();
        const sig = generateSignature(tid);
        const baseUrl = process.env.VERIFY_BASE_URL || "http://localhost:4000/api/tourist/verify";
        const verifyLink = `${baseUrl}?tid=${tid}&sig=${sig}`;
        const qrCode = await generateQRCode(verifyLink);

        const record = await prisma.touristID.create({
            data: {
                touristId,
                tid,
                signature: sig,
                version: "1.0",
                qrCodeUrl: qrCode,
                expiresAt: latestTrip.endDate
            }
        });

        await prisma.tourist.update({
            where: { id: touristId },
            data: { verified: true }
        });

        res.json({
            message: "Tourist approved. Digital ID generated.",
            dtid: record
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating Digital Tourist ID" });
    }
});


export default router;
