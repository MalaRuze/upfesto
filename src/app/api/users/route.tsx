import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { userSchema } from "@/app/api/users/schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }
  const user = await prisma.user.create({
    data: {
      id: body.id,
      firstName: body.firstName,
      lastName: body.lastName,
      fullName: body.fullName,
      email: body.email,
      profileImageUrl: body.profileImageUrl,
    },
  });
  return NextResponse.json(user, { status: 201 });
}
