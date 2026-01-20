import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { initializeSocket } from "./socket/socketHandler.js";

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:", "https://iiuc-lost-found.vercel.app"],
  credentials: true,
};

app.use(express.json({ limit: "10mb" }));
app.use(cors(corsOptions));

// Socket.io setup
const io = new Server(httpServer, { cors: corsOptions });
initializeSocket(io);

// Routes
app.use(authRoutes);
app.use(reportRoutes);
app.use(claimRoutes);
app.use(messageRoutes);

app.get("/", (req, res) => {
  res.send("IIUC Lost & Found API is running successfully.");
});

app.get("/ping", (req, res) => {
  res.send("Server is awake! 🟢");
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
