import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const POST = async (req: NextRequest) => {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newAccessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error:error }, { status: 401 });
  }
};
