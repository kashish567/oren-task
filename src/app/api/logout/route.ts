// /app/api/auth/logout/route.ts

import { NextResponse } from "next/server";

export const POST = async () => {
  const response = NextResponse.json({ success: true });
  
  // Clear the refreshToken cookie
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return response;
};
