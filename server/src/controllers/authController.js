import { z } from "zod";
import { prisma } from "../database/prisma.js";

export const userSchema = z.object({
  firebaseUid: z.string(),
  fullName: z.string(),
  //email: z.email().endsWith("@ugrad.iiuc.ac.bd", { message: "Must be IIUC mail" }),
  email: z.email(),
  profilePic: z.string().optional(),
});

export const signIn = async (req, res) => {
  const data = req.validatedData;
  try {
    const userByEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    const userByFirebaseUid = await prisma.user.findUnique({
      where: { firebaseUid: data.firebaseUid },
    });
    if (userByEmail && userByFirebaseUid) {
      if (userByEmail.id !== userByFirebaseUid.id) {
        return res.status(400).json({
          status: "error",
          message: "Email or Firebase UID already exists with different account",
        });
      }
      return res.json({
        status: "success",
        message: "Sign in successful",
        data: { user: userByEmail },
      });
    }
    if (userByEmail) {
      const updatedUser = await prisma.user.update({
        where: { email: data.email },
        data: { 
          firebaseUid: data.firebaseUid,
          fullName: data.fullName,
          profilePic: data.profilePic,
        },
      });
      return res.json({
        status: "success",
        message: "User updated with new Firebase account",
        data: { user: updatedUser },
      });
    }
    if (userByFirebaseUid) {
      return res.status(400).json({
        status: "error",
        message: "Firebase UID already registered with different email",
      });
    }
    const user = await prisma.user.create({
      data: {
        firebaseUid: data.firebaseUid,
        fullName: data.fullName,
        email: data.email,
        profilePic: data.profilePic,
      },
    });
    res.json({
      status: "success",
      message: "User created",
      data: { user },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getUserCount = async (req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({
      status: "success",
      data: { count },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const updateGenderSchema = z.object({
  userId: z.uuid(),
  gender: z.enum(["MALE", "FEMALE"]),
});

export const updateGender = async (req, res) => {
  const data = req.validatedData;
  try {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    const updatedUser = await prisma.user.update({
      where: { id: data.userId },
      data: { gender: data.gender },
    });
    res.json({
      status: "success",
      message: "Gender updated successfully",
      data: { user: updatedUser },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
