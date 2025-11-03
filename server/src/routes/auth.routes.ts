import { Router } from "express";
import prisma from "../prisma";

import {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/auth";

const router = Router();

// helper to save refresh token
const storeRefreshToken = async (token: string, userId: string, role: string, expiresIn: number) => {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    await prisma.refreshToken.create({
        data: { token, userId, role, expiresAt },
    });
};

// ============ Tourist Auth ============ //
router.post("/tourist/register", async (req, res) => {
    const { name, email, password, passportNumber, aadhaarNumber } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    if (!passportNumber && !aadhaarNumber) {
        return res.status(400).json({ message: "Either passport or Aadhaar number is required." });
    }

    const existing = await prisma.tourist.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already used' });


    try {
        const hashed = await hashPassword(password);
        const tourist = await prisma.tourist.create({
            data: {
                name,
                email,
                password: hashed,
                aadhaarNumber,
                passportNumber,
                touristId: `TID-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
            },
        });


        const payload = { id: tourist.id, role: "tourist" };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        await storeRefreshToken(refreshToken, tourist.id, "tourist", 7 * 24 * 60 * 60);

        res.json({ accessToken, refreshToken, tourist });
    } catch (err: any) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

router.post("/tourist/login", async (req, res) => {
    const { email, password } = req.body;
    const tourist = await prisma.tourist.findUnique({ where: { email } });
    if (!tourist) return res.status(404).json({ message: "User not found" });

    const valid = await comparePassword(password, tourist.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: tourist.id, role: "tourist" };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await storeRefreshToken(refreshToken, tourist.id, "tourist", 7 * 24 * 60 * 60);

    res.json({ accessToken, refreshToken });
});

// ============ Admin Auth ============ //
router.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const valid = await comparePassword(password, admin.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: admin.id, role: admin.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await storeRefreshToken(refreshToken, admin.id, admin.role, 7 * 24 * 60 * 60);

    res.json({ accessToken, refreshToken });
});

// ============ Token Refresh ============ //
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "No refresh token provided" });

    try {
        const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!stored) return res.status(403).json({ message: "Invalid refresh token" });

        const decoded = verifyRefreshToken(refreshToken) as any;
        const accessToken = generateAccessToken({ id: decoded.id, role: decoded.role });

        res.json({ accessToken });
    } catch {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
});

// ============ Logout ============ //
router.post("/logout", async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ message: "Logged out successfully" });
});

export default router;
