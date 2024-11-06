import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    

    if (!email || !password) {
      return NextResponse.json({ error: "Please fill all fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return NextResponse.json({ email: user.email, success: true }, { status: 201 });
  } catch (error:any) {
    console.log(error.message)
    return NextResponse.json({ error: "An unexpected error occurred"}, { status: 500 });
  }
};
