import { z } from "zod";
import { prisma } from "../database/prisma.js";

export const claimSchema = z.object({
  reportId: z.uuid(),
  claimerId: z.uuid(),
});

export const confirmSchema = z.object({
  claimId: z.uuid(),
});

export const rejectSchema = z.object({
  claimId: z.uuid(),
  finderId: z.uuid(),
});

export const cancelSchema = z.object({
  claimId: z.uuid(),
  claimerId: z.uuid(),
});

const checkResolution = async (claimId) => {
  const claim = await prisma.claim.findUnique({ where: { id: claimId } });
  if (claim && claim.finderConfirmed && claim.ownerConfirmed) {
    await prisma.claim.update({
      where: { id: claimId },
      data: { status: "SOLVED" }
    });
    await prisma.report.update({
      where: { id: claim.reportId },
      data: { status: "SOLVED" }
    });
    return true;
  }
  return false;
};

export const createClaim = async (req, res) => {
  const data = req.validatedData;
  try {
    const report = await prisma.report.findUnique({
      where: { id: data.reportId }
    });
    if (!report) {
      return res.status(404).json({ status: "error", message: "Report not found" });
    }
    if (report.status === "SOLVED") {
      return res.status(400).json({ status: "error", message: "Item already solved" });
    }
    if (report.finderId === data.claimerId) {
      return res.status(400).json({ status: "error", message: "You cannot claim your own report" });
    }
    
    // Check if there's ANY pending claim (by anyone)
    const existingPendingClaim = await prisma.claim.findFirst({
      where: { 
        reportId: data.reportId,
        status: "PENDING"
      }
    });
    if (existingPendingClaim) {
      return res.status(400).json({ status: "error", message: "Item already has an active claim" });
    }
    
    // Check if THIS USER has an existing claim for this report
    const userExistingClaim = await prisma.claim.findFirst({
      where: {
        reportId: data.reportId,
        claimerId: data.claimerId
      }
    });
    
    let claim;
    if (userExistingClaim && (userExistingClaim.status === "CANCELLED" || userExistingClaim.status === "REJECTED")) {
      // User is re-claiming - update THEIR existing claim record
      claim = await prisma.claim.update({
        where: { id: userExistingClaim.id },
        data: {
          status: "PENDING",
          finderConfirmed: false,
          ownerConfirmed: false
        }
      });
    } else if (!userExistingClaim) {
      // New claim - create fresh record
      claim = await prisma.claim.create({
        data: {
          reportId: data.reportId,
          claimerId: data.claimerId,
        },
      });
    } else {
      // User already has an active claim
      return res.status(400).json({ status: "error", message: "You already have an active claim for this item" });
    }
    
    res.json({
      status: "success",
      message: "Claim request sent successfully",
      data: { claim },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const confirmFinder = async (req, res) => {
  const data = req.validatedData;
  try {
    const claim = await prisma.claim.findUnique({ where: { id: data.claimId } });
    if (!claim) {
      return res.status(404).json({ status: "error", message: "Claim not found" });
    }
    await prisma.claim.update({
      where: { id: data.claimId },
      data: { finderConfirmed: true }
    });
    const isSolved = await checkResolution(data.claimId);
    res.json({
      status: "success",
      message: isSolved ? "Item fully solved" : "Finder confirmed handover",
      data: { status: isSolved ? "SOLVED" : "PENDING" },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const confirmOwner = async (req, res) => {
  const data = req.validatedData;
  try {
    const claim = await prisma.claim.findUnique({ where: { id: data.claimId } });
    if (!claim) {
      return res.status(404).json({ status: "error", message: "Claim not found" });
    }
    await prisma.claim.update({
      where: { id: data.claimId },
      data: { ownerConfirmed: true }
    });
    const isSolved = await checkResolution(data.claimId);
    res.json({
      status: "success",
      message: isSolved ? "Item fully solved" : "Owner confirmed receipt",
      data: { status: isSolved ? "SOLVED" : "PENDING" },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const rejectClaim = async (req, res) => {
  const data = req.validatedData;
  try {
    const claim = await prisma.claim.findUnique({ 
      where: { id: data.claimId },
      include: { report: true }
    });
    if (!claim) {
      return res.status(404).json({ status: "error", message: "Claim not found" });
    }
    if (claim.status !== "PENDING") {
      return res.status(400).json({ status: "error", message: "Only pending claims can be rejected" });
    }
    if (claim.report.finderId !== data.finderId) {
      return res.status(403).json({ status: "error", message: "Only the finder can reject this claim" });
    }
    await prisma.claim.update({
      where: { id: data.claimId },
      data: { status: "REJECTED" }
    });
    res.json({
      status: "success",
      message: "Claim rejected successfully",
      data: { claimId: data.claimId, status: "REJECTED" },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const cancelClaim = async (req, res) => {
  const data = req.validatedData;
  try {
    const claim = await prisma.claim.findUnique({ where: { id: data.claimId } });
    if (!claim) {
      return res.status(404).json({ status: "error", message: "Claim not found" });
    }
    if (claim.status !== "PENDING") {
      return res.status(400).json({ status: "error", message: "Only pending claims can be cancelled" });
    }
    if (claim.claimerId !== data.claimerId) {
      return res.status(403).json({ status: "error", message: "Only the claimer can cancel this claim" });
    }
    await prisma.claim.update({
      where: { id: data.claimId },
      data: { status: "CANCELLED" }
    });
    res.json({
      status: "success",
      message: "Claim cancelled successfully",
      data: { claimId: data.claimId, status: "CANCELLED" },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getClaimsByUser = async (req, res) => {
  try {
    const { odId } = req.params;
    const claims = await prisma.claim.findMany({
      where: { claimer: { firebaseUid: odId } },
      orderBy: { claimedAt: 'desc' },
      include: {
        report: {
          include: {
            finder: {
              select: { id: true, fullName: true, email: true, profilePic: true }
            }
          }
        },
        claimer: {
          select: { id: true, fullName: true, email: true, profilePic: true }
        }
      }
    });
    res.json({
      status: "success",
      message: "User claims fetched successfully",
      data: { claims }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
