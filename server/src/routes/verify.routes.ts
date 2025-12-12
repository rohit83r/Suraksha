import { Router } from "express";
import prisma from "../prisma";
import crypto from "crypto";

const router = Router();

// src/routes/verify.routes.ts
router.get("/verify", async (req, res) => {
    const { tid, sig } = req.query;
    if (!tid || !sig) return res.status(400).send("Invalid QR link");

    try {
        const record = await prisma.touristID.findUnique({
            where: {
                tid: tid as string
            },
            include: {
                tourist: {
                    include: {
                        trips: true,
                        emergencyContacts: true
                    }
                }
            }
        });

        if (!record) return res.status(404).send("Tourist ID not found");

        // validate HMAC
        const expectedSig = crypto.createHmac("sha256", process.env.DTID_SECRET!).update(tid as string).digest("hex");
        if (expectedSig !== sig) return res.status(400).send("QR tampered");

        if (!record.active || record.expiresAt < new Date()) return res.status(400).send("Tourist ID expired");

        const activeTrip = record.tourist.trips.find(t => t.startDate <= new Date() && t.endDate >= new Date());

        // Optionally: Render an HTML page
        return res.send(`
            <h2>Tourist Verified ✅</h2>
            <p>Name: ${record.tourist.name}</p>
            <p>Email: ${record.tourist.email}</p>
            <p>Tourist ID: ${record.tid}</p>
            <p>Issued On: ${record.updatedAt}</p>
            <p>Valid Till: ${record.expiresAt}</p>
            <h3>Active Trip Details:</h3>
            <p> Start Date: ${activeTrip ? activeTrip.startDate : "No active trip"}</p>
            <p> End Date: ${activeTrip ? activeTrip.endDate : "No active trip"}</p>
            <p>Trip Itinerary: ${activeTrip?.itinerary ? JSON.stringify(activeTrip.itinerary) : "No active trip"}</p>

            <H3>Emergency Contacts:</h3>
            <ul>
                ${record.tourist.emergencyContacts.map(ec => `<li>${ec.name} - ${ec.phone} (${ec.relation})</li>`).join("")}
            </ul>
            <p>Status: Valid</p>
        `);

    } catch (err) {
        console.error(err);
        res.status(500).send("Verification error");
    }
});


export default router;
