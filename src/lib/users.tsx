import prisma from "../../prisma/client";

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
