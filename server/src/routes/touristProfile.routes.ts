import { Router } from "express";
import {
    getTouristProfile,
    updateTouristProfile,
    deleteTouristAccount,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
} from "../controllers/touristProfile.controller";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();


router.use(authenticate);
router.get("/profile", getTouristProfile);
router.put("/profile", updateTouristProfile);
router.delete("/profile", deleteTouristAccount);

router.post("/emergency-contacts", addEmergencyContact);
router.put("/emergency-contacts/:id", updateEmergencyContact);
router.delete("/emergency-contacts/:id", deleteEmergencyContact);

// TODO : KYC / PROFILE VERIFICATION ROUTES
// TODO : QR CODE GENERATION ROUTES AND HANDLING

export default router;
