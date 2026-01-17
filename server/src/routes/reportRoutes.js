import { Router } from "express";
import { getCategories, createReport, getAllReports, getReportById, getReportsByUser, reportSchema } from "../controllers/reportController.js";
import { uploadImage } from "../controllers/uploadController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/upload-image", uploadImage);
router.post("/report", validateRequest(reportSchema), createReport);
router.get("/reports", getAllReports);
router.get("/reports/user/:odId", getReportsByUser);
router.get("/reports/:id", getReportById);

export default router;
