import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "@/app/api/users/schema";
import prisma from "../../../../../prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: params.id,
    },
    data: {
      id: body.id,
      firstName: body.firstName,
      lastName: body.lastName,
      fullName: body.fullName,
      email: body.email,
      profileImageUrl: body.profileImageUrl,
    },
  });
  return NextResponse.json(updatedUser, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  await prisma.user.delete({
    where: {
      id: params.id,
    },
  });
  return NextResponse.json({ message: "User deleted" }, { status: 200 });
}
