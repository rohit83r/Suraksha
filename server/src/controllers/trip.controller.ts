import { Request, Response } from "express";
import prisma from "../prisma";

/**
 * Create a new Trip
 */
export const createTrip = async (req: Request, res: Response) => {
    try {
        const touristId = (req as any).user.id;
        const { startDate, endDate, itinerary } = req.body;

        if (!startDate || !endDate || !itinerary) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const trip = await prisma.trip.create({
            data: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                itinerary,
                touristId,
            },
        });

        res.status(201).json({ message: "Trip created successfully.", trip });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating trip." });
    }
};

/**
 * Get all trips of the logged-in tourist
 */
export const getAllTrips = async (req: Request, res: Response) => {
    try {
        const touristId = (req as any).user.id;

        const trips = await prisma.trip.findMany({
            where: { touristId },
            orderBy: { startDate: "asc" },
        });

        res.status(200).json({ trips });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching trips." });
    }
};

/**
 * Get details of a single trip
 */
export const getTripById = async (req: Request, res: Response) => {
    try {
        const touristId = (req as any).user.id;
        const { id } = req.params;

        const trip = await prisma.trip.findFirst({
            where: { id, touristId },
        });

        if (!trip) {
            return res.status(404).json({ message: "Trip not found." });
        }

        res.status(200).json({ trip });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching trip." });
    }
};

/**
 * Update a trip
 */
export const updateTrip = async (req: Request, res: Response) => {
    try {
        const touristId = (req as any).user.id;
        const { id } = req.params;
        const { startDate, endDate, itinerary, status } = req.body;

        const existingTrip = await prisma.trip.findFirst({
            where: { id, touristId },
        });

        if (!existingTrip) {
            return res.status(404).json({ message: "Trip not found." });
        }

        const updatedTrip = await prisma.trip.update({
            where: { id },
            data: {
                startDate: startDate ? new Date(startDate) : existingTrip.startDate,
                endDate: endDate ? new Date(endDate) : existingTrip.endDate,
                itinerary: itinerary || existingTrip.itinerary,
                status: status || existingTrip.status,
            },
        });

        res.status(200).json({ message: "Trip updated successfully.", updatedTrip });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating trip." });
    }
};

/**
 * Delete a trip
 */
export const deleteTrip = async (req: Request, res: Response) => {
    try {
        const touristId = (req as any).user.id;
        const { id } = req.params;

        const trip = await prisma.trip.findFirst({
            where: { id, touristId },
        });

        if (!trip) {
            return res.status(404).json({ message: "Trip not found." });
        }

        await prisma.trip.delete({ where: { id } });

        res.status(200).json({ message: "Trip deleted successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting trip." });
    }
};

export const getActiveTrip = async (req: Request, res: Response) => {
    // only one active trip per tourist
    const touristId = (req as any).user.id;
    const activeTrip = await prisma.trip.findFirst({
        where: { touristId, status: "ACTIVE" },
    })
    res.status(200).json({ activeTrip });
}

