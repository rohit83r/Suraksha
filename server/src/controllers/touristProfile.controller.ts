import { Request, Response } from "express";
import prisma from "../prisma"

export const getTouristProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // set in middleware
        const tourist = await prisma.tourist.findUnique({
            where: { id: userId },
            include: { emergencyContacts: true, trips: true },
        });

        if (!tourist) return res.status(404).json({ message: "Tourist not found" });

        res.status(200).json({
            profile: {
                name: tourist.name,
                email: tourist.email,
                passportNumber: tourist.passportNumber,
                aadhaarNumber: tourist.aadhaarNumber,
                verified: tourist.verified,
                emergencyContacts: tourist.emergencyContacts,
                trips: tourist.trips,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching tourist profile" });
    }
};

export const updateTouristProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { name, passportNumber, aadhaarNumber } = req.body;

        const tourist = await prisma.tourist.update({
            where: { id: userId },
            data: { name, passportNumber, aadhaarNumber },
        });

        res.status(200).json({
            message: "Profile updated successfully",
            tourist,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating profile" });
    }
};


export const deleteTouristAccount = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        await prisma.tourist.delete({ where: { id: userId } });
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting account" });
    }
};

export const addEmergencyContact = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { name, phone, relation } = req.body;

        const contact = await prisma.emergencyContact.create({
            data: {
                name,
                phone,
                relation,
                touristId: userId,
            },
        });

        res.status(201).json({ message: "Contact added", contact });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding contact" });
    }
};

export const updateEmergencyContact = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, phone, relation } = req.body;
        const contact = await prisma.emergencyContact.update({
            where: { id },
            data: { name, phone, relation },
        });
        res.status(200).json({ message: "Contact updated", contact });
    } catch (err) {
        res.status(500).json({ message: "Error updating contact" });
    }
};

export const deleteEmergencyContact = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.emergencyContact.delete({ where: { id } });
        res.status(200).json({ message: "Contact deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting contact" });
    }
};

