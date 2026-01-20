import { z } from "zod";
import { prisma } from "../database/prisma.js";

// Validation schemas
export const sendMessageSchema = z.object({
  claimId: z.uuid(),
  senderId: z.uuid(),
  content: z.string().min(1).max(1000),
});

export const markReadSchema = z.object({
  claimId: z.uuid(),
  userId: z.uuid(),
});

export const getMessagesSchema = z.object({
  claimId: z.uuid(),
});

// Get user's inbox - all claims with messages where user is finder or claimer
export const getInbox = async (req, res) => {
  try {
    const { odId } = req.params; // Firebase UID

    // First get the user by firebase UID
    const user = await prisma.user.findUnique({
      where: { firebaseUid: odId },
    });

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Get all claims where user is either finder (via report) or claimer
    // AND has at least one message
    const claims = await prisma.claim.findMany({
      where: {
        AND: [
          {
            OR: [
              { claimerId: user.id },
              { report: { finderId: user.id } },
            ],
          },
          {
            messages: {
              some: {}, // At least one message exists
            },
          },
        ],
      },
      include: {
        report: {
          include: {
            finder: {
              select: { id: true, fullName: true, profilePic: true },
            },
          },
        },
        claimer: {
          select: { id: true, fullName: true, profilePic: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get only the latest message
          include: {
            sender: {
              select: { id: true, fullName: true },
            },
          },
        },
      },
      orderBy: {
        claimedAt: "desc",
      },
    });

    // Transform the data for inbox display
    const inbox = await Promise.all(
      claims.map(async (claim) => {
        const isFinder = claim.report.finderId === user.id;
        const otherUser = isFinder ? claim.claimer : claim.report.finder;
        const latestMessage = claim.messages[0];

        // Count unread messages from the other person
        const unreadCount = await prisma.message.count({
          where: {
            claimId: claim.id,
            senderId: otherUser.id,
            isRead: false,
          },
        });

        return {
          claimId: claim.id,
          reportId: claim.reportId,
          reportTitle: claim.report.title,
          claimStatus: claim.status,
          otherUser: {
            id: otherUser.id,
            name: otherUser.fullName,
            profilePic: otherUser.profilePic,
          },
          myRole: isFinder ? "finder" : "claimer",
          unreadCount,
          latestMessage: latestMessage
            ? {
                id: latestMessage.id,
                content: latestMessage.content,
                senderId: latestMessage.senderId,
                senderName: latestMessage.sender.fullName,
                isFromMe: latestMessage.senderId === user.id,
                createdAt: latestMessage.createdAt,
              }
            : null,
          updatedAt: latestMessage?.createdAt || claim.claimedAt,
        };
      })
    );

    // Sort by latest activity
    inbox.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json({
      status: "success",
      message: "Inbox fetched successfully",
      data: { inbox },
    });
  } catch (err) {
    console.error("getInbox error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get total unread message count for navbar badge
export const getUnreadCount = async (req, res) => {
  try {
    const { odId } = req.params;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: odId },
    });

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Get all claims where user is finder or claimer
    const claims = await prisma.claim.findMany({
      where: {
        OR: [
          { claimerId: user.id },
          { report: { finderId: user.id } },
        ],
      },
      select: {
        id: true,
        claimerId: true,
        report: { select: { finderId: true } },
      },
    });

    // Count unread messages sent by others in all these claims
    let totalUnread = 0;
    for (const claim of claims) {
      const otherUserId =
        claim.report.finderId === user.id ? claim.claimerId : claim.report.finderId;

      const count = await prisma.message.count({
        where: {
          claimId: claim.id,
          senderId: otherUserId,
          isRead: false,
        },
      });
      totalUnread += count;
    }

    res.json({
      status: "success",
      data: { unreadCount: totalUnread },
    });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get all messages for a specific claim
export const getMessages = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { odId } = req.query; // Firebase UID for authorization

    const user = await prisma.user.findUnique({
      where: { firebaseUid: odId },
    });

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Verify user is part of this claim
    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
      include: {
        report: { select: { finderId: true, title: true } },
        claimer: { select: { id: true, fullName: true, profilePic: true } },
      },
    });

    if (!claim) {
      return res.status(404).json({ status: "error", message: "Claim not found" });
    }

    const isFinder = claim.report.finderId === user.id;
    const isClaimer = claim.claimerId === user.id;

    if (!isFinder && !isClaimer) {
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    // Get the other user's info
    const otherUser = isFinder
      ? claim.claimer
      : await prisma.user.findUnique({
          where: { id: claim.report.finderId },
          select: { id: true, fullName: true, profilePic: true },
        });

    const messages = await prisma.message.findMany({
      where: { claimId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { id: true, fullName: true, profilePic: true },
        },
      },
    });

    res.json({
      status: "success",
      data: {
        messages,
        claim: {
          id: claim.id,
          reportTitle: claim.report.title,
          status: claim.status,
        },
        otherUser,
        myRole: isFinder ? "finder" : "claimer",
      },
    });
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  const data = req.validatedData;
  try {
    // Verify the claim exists and user is part of it
    const claim = await prisma.claim.findUnique({
      where: { id: data.claimId },
      include: {
        report: { select: { finderId: true } },
      },
    });

    if (!claim) {
      return res.status(404).json({ status: "error", message: "Claim not found" });
    }

    const isFinder = claim.report.finderId === data.senderId;
    const isClaimer = claim.claimerId === data.senderId;

    if (!isFinder && !isClaimer) {
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    const message = await prisma.message.create({
      data: {
        claimId: data.claimId,
        senderId: data.senderId,
        content: data.content,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, profilePic: true },
        },
      },
    });

    res.json({
      status: "success",
      message: "Message sent successfully",
      data: { message },
    });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Mark messages as read for a claim
export const markMessagesAsRead = async (req, res) => {
  const data = req.validatedData;
  try {
    const claim = await prisma.claim.findUnique({
      where: { id: data.claimId },
      include: {
        report: { select: { finderId: true } },
      },
    });

    if (!claim) {
      return res.status(404).json({ status: "error", message: "Claim not found" });
    }

    // Determine who the other user is
    const isFinder = claim.report.finderId === data.userId;
    const isClaimer = claim.claimerId === data.userId;

    if (!isFinder && !isClaimer) {
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    const otherUserId = isFinder ? claim.claimerId : claim.report.finderId;

    // Mark all messages from the other user as read
    const result = await prisma.message.updateMany({
      where: {
        claimId: data.claimId,
        senderId: otherUserId,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({
      status: "success",
      message: `${result.count} messages marked as read`,
      data: { markedCount: result.count },
    });
  } catch (err) {
    console.error("markMessagesAsRead error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
