import { UserDataSchema } from "@/lib/schema";
import prisma from "@/prisma/client";
import { z } from "zod";

export const getPublicUserInfoById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        fullName: true,
        profileImageUrl: true,
      },
    });
    return { user };
  } catch (error) {
    console.error(error);
    throw new Error("Error finding user.");
  }
};

export const createUser = async (data: z.infer<typeof UserDataSchema>) => {
  try {
    const user = await prisma.user.create({
      data: {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        email: data.email,
        profileImageUrl: data.profileImageUrl,
      },
    });
    return { user };
  } catch (error) {
    console.error(error);
    throw new Error("Error creating user.");
  }
};

export const updateUser = async (data: z.infer<typeof UserDataSchema>) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        email: data.email,
        profileImageUrl: data.profileImageUrl,
      },
    });
    return { user };
  } catch (error) {
    console.error(error);
    throw new Error("Error updating user.");
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return { message: "User deleted" };
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting user.");
  }
};
