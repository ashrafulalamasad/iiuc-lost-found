import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://iiuc-lost-found.vercel.app" // Add your Production URL here once verified
  ],
  credentials: true
}));

app.use(authRoutes);
app.use(reportRoutes);
app.use(claimRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
