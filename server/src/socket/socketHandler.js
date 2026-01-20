import { prisma } from "../database/prisma.js";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a claim room for real-time messaging
    socket.on("joinClaim", (claimId) => {
      socket.join(`claim:${claimId}`);
      console.log(`Socket ${socket.id} joined claim:${claimId}`);
    });

    // Leave a claim room
    socket.on("leaveClaim", (claimId) => {
      socket.leave(`claim:${claimId}`);
      console.log(`Socket ${socket.id} left claim:${claimId}`);
    });

    // Handle sending messages via socket
    socket.on("sendMessage", async (data) => {
      try {
        const { claimId, senderId, content } = data;

        // Verify the claim exists and user is part of it
        const claim = await prisma.claim.findUnique({
          where: { id: claimId },
          include: {
            report: { select: { finderId: true } },
          },
        });

        if (!claim) {
          socket.emit("messageError", { error: "Claim not found" });
          return;
        }

        const isFinder = claim.report.finderId === senderId;
        const isClaimer = claim.claimerId === senderId;

        if (!isFinder && !isClaimer) {
          socket.emit("messageError", { error: "Unauthorized" });
          return;
        }

        // Create the message in database
        const message = await prisma.message.create({
          data: {
            claimId,
            senderId,
            content,
          },
          include: {
            sender: {
              select: { id: true, fullName: true, profilePic: true },
            },
          },
        });

        // Broadcast to everyone in the claim room (including sender)
        io.to(`claim:${claimId}`).emit("newMessage", message);

        // Also notify for inbox updates
        const otherUserId = isFinder ? claim.claimerId : claim.report.finderId;
        io.emit(`inboxUpdate:${otherUserId}`, { claimId, message });

      } catch (err) {
        console.error("Socket sendMessage error:", err);
        socket.emit("messageError", { error: err.message });
      }
    });

    // Handle marking messages as read
    socket.on("markRead", async (data) => {
      try {
        const { claimId, userId } = data;

        const claim = await prisma.claim.findUnique({
          where: { id: claimId },
          include: {
            report: { select: { finderId: true } },
          },
        });

        if (!claim) return;

        const isFinder = claim.report.finderId === userId;
        const otherUserId = isFinder ? claim.claimerId : claim.report.finderId;

        await prisma.message.updateMany({
          where: {
            claimId,
            senderId: otherUserId,
            isRead: false,
          },
          data: { isRead: true },
        });

        // Notify the room that messages were read
        io.to(`claim:${claimId}`).emit("messagesRead", { claimId, readBy: userId });

      } catch (err) {
        console.error("Socket markRead error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
