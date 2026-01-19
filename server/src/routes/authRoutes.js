import { Router } from "express";
import { signIn, getUserCount, updateGender, userSchema, updateGenderSchema } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post("/auth", validateRequest(userSchema), signIn);
router.get("/users/count", getUserCount);
router.put("/users/gender", validateRequest(updateGenderSchema), updateGender);

export default router;
