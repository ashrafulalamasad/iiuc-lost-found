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
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://iiuc-lost-found.vercel.app",
    ];
    // Allow requests with no origin (mobile apps, curl, etc.)
    // or from allowed origins, or from any 192.168.x.x LAN IP for dev
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
      /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
      /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
