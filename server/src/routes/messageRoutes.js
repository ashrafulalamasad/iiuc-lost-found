import { Router } from "express";
import { getInbox, getUnreadCount, getMessages, sendMessage, markMessagesAsRead, sendMessageSchema, markReadSchema } from "../controllers/messageController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

// Get user's inbox (all conversations with messages)
router.get("/messages/inbox/:odId", getInbox);

// Get total unread count for badge
router.get("/messages/unread/:odId", getUnreadCount);

// Get all messages for a specific claim
router.get("/messages/:claimId", getMessages);

// Send a new message
router.post("/messages", validateRequest(sendMessageSchema), sendMessage);

// Mark messages as read for a claim
router.put(
  "/messages/read",
  validateRequest(markReadSchema),
  markMessagesAsRead,
);

export default router;
