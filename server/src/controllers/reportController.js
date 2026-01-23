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
}).refine((data) => {
  // If location is "With Me (Self)", contactInfo is required
  if (data.location === "With Me (Self)" && !data.contactInfo) {
    return false;
  }
  return true;
}, {
  message: "Contact info is required when keeping the item with you",
  path: ["contactInfo"],
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
    const { category, status, page = 1, limit = 10 } = req.query;
    const validCategories = ["DOCUMENTS", "ELECTRONICS", "BOOKS_AND_NOTES", "ACCESSORIES", "STATIONERY", "OTHERS", "ALL"];
    const validStatuses = ["SOLVED", "UNSOLVED", "ALL"];
    
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid category."
      });
    }
    
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid status."
      });
    }
    
    // Parse pagination parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // Validate pagination parameters
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        status: "error",
        message: "Invalid page number."
      });
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
      return res.status(400).json({
        status: "error",
        message: "Invalid limit. Must be between 1 and 1000."
      });
    }
    
    const whereClause = {};
    if (category && category !== "ALL") {
      whereClause.category = category;
    }
    if (status && status !== "ALL") {
      whereClause.status = status;
    }
    
    // Calculate skip value for pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination metadata
    const totalCount = await prisma.report.count({
      where: whereClause
    });
    
    // Fetch paginated reports
    const reports = await prisma.report.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: limitNum,
      include: {
        finder: {
          select: { id: true, fullName: true, email: true, profilePic: true, gender: true }
        },
        claims: {
          include: {
            claimer: {
              select: { id: true, fullName: true, email: true, profilePic: true, gender: true }
            }
          }
        }
      }
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    res.json({
      status: "success",
      message: "Reports fetched successfully",
      data: { 
        reports,
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages,
          totalCount: totalCount,
          limit: limitNum,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage
        }
      },
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
          select: { id: true, fullName: true, email: true, profilePic: true, gender: true }
        },
        claims: {
          include: {
            claimer: {
              select: { id: true, fullName: true, email: true, profilePic: true, gender: true }
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
          select: { id: true, fullName: true, email: true, profilePic: true, gender: true }
        },
        claims: {
          include: {
            claimer: {
              select: { id: true, fullName: true, email: true, profilePic: true, gender: true }
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
