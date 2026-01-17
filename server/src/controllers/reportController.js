import { z } from "zod";
import { prisma } from "../database/prisma.js";

export const reportSchema = z.object({
  finderId: z.uuid(),
  category: z.enum(["DOCUMENTS", "ELECTRONICS", "BOOKS_AND_NOTES", "ACCESSORIES", "STATIONERY", "OTHERS"]),
  title: z.string().min(3),
  description: z.string().min(5),
  location: z.string().min(2),
  contactInfo: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number").or(z.literal("")).transform(val => val || null).nullable().optional(),
  images: z.array(z.string()).max(4).default([]),
});

export const getCategories = async (req, res) => {
  try {
    const categories = [
      "DOCUMENTS",
      "ELECTRONICS",
      "BOOKS_AND_NOTES",
      "ACCESSORIES",
      "STATIONERY",
      "OTHERS"
    ];
    res.json({
      status: "success",
      message: "Categories fetched successfully",
      data: { categories }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const createReport = async (req, res) => {
  const data = req.validatedData;
  try {
    const finder = await prisma.user.findUnique({ where: { id: data.finderId } });
    if (!finder) {
      return res.status(404).json({ status: "error", message: "Finder not found" });
    }
    const report = await prisma.report.create({
      data: {
        finderId: data.finderId,
        category: data.category,
        title: data.title,
        description: data.description,
        location: data.location,
        contactInfo: data.contactInfo,
        images: data.images,
        status: "UNSOLVED"
      },
    });
    res.json({
      status: "success",
      message: "Item reported successfully",
      data: { report }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const { category } = req.query;
    const validCategories = ["DOCUMENTS", "ELECTRONICS", "BOOKS_AND_NOTES", "ACCESSORIES", "STATIONERY", "OTHERS", "ALL"];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid category."
      });
    }
    const whereClause = {};
    if (category && category !== "ALL") {
      whereClause.category = category;
    }
    const reports = await prisma.report.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        finder: {
          select: { id: true, fullName: true, email: true, profilePic: true }
        },
        claim: {
          include: {
            claimer: {
              select: { id: true, fullName: true, email: true, profilePic: true }
            }
          }
        }
      }
    });
    res.json({
      status: "success",
      message: "Reports fetched successfully",
      data: { reports },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

export const getReportsByUser = async (req, res) => {
  try {
    const { odId } = req.params;
    const reports = await prisma.report.findMany({
      where: { finder: { firebaseUid: odId } },
      orderBy: { createdAt: 'desc' },
      include: {
        finder: {
          select: { id: true, fullName: true, email: true, profilePic: true }
        },
        claim: {
          include: {
            claimer: {
              select: { id: true, fullName: true, email: true, profilePic: true }
            }
          }
        }
      }
    });
    res.json({
      status: "success",
      message: "User reports fetched successfully",
      data: { reports }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: {
        finder: {
          select: { id: true, fullName: true, email: true, profilePic: true }
        },
        claim: {
          include: {
            claimer: {
              select: { id: true, fullName: true, email: true, profilePic: true }
            }
          }
        }
      }
    });
    if (!report) {
      return res.status(404).json({ status: "error", message: "Report not found" });
    }
    res.json({
      status: "success",
      message: "Report fetched successfully",
      data: { report },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
