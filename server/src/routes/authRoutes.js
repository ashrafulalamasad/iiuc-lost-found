import { Router } from "express";
import { signIn, getUserCount, userSchema } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post("/auth", validateRequest(userSchema), signIn);
router.get("/users/count", getUserCount);

export default router;
