import { Router } from "express";
import {
    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    deleteTrip,
    getActiveTrip,
} from "../controllers/trip.controller";


const router = Router();

router.post("/", createTrip);
router.get("/", getAllTrips);
router.get("/active", getActiveTrip);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;
