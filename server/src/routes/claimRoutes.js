import { Router } from "express";
import { createClaim, confirmFinder, confirmOwner, rejectClaim, cancelClaim, getClaimsByUser, claimSchema, confirmSchema, rejectSchema, cancelSchema } from "../controllers/claimController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post("/claim", validateRequest(claimSchema), createClaim);
router.get("/claims/user/:odId", getClaimsByUser);
router.post("/confirm/finder", validateRequest(confirmSchema), confirmFinder);
router.post("/confirm/owner", validateRequest(confirmSchema), confirmOwner);
router.post("/claim/reject", validateRequest(rejectSchema), rejectClaim);
router.post("/claim/cancel", validateRequest(cancelSchema), cancelClaim);

export default router;
