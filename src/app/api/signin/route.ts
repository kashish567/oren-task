import prisma from "@/lib/prisma"; // Ensure prisma client is imported correctly
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate input fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Please fill all fields" },
        { status: 400 }
      );
    }

    // Find the user with the given email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist", success: false },
        { status: 400 }
      );
    }

    // Compare passwords
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return NextResponse.json(
        { error: "Invalid credentials", success: false },
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return NextResponse.json({ token, success: true, email }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};
