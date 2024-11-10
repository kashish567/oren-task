import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export const POST = async (req: NextRequest) => {
  try {
    // Extract token from headers
    const token = req.headers.get("Authorization")?.split(" ")[1]; // Bearer token
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Verify token and extract user ID
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const userId = (decoded as { userId: number }).userId;

    // Get the metrics data array from the request body
    const { metrics } = await req.json();
    console.log(metrics);

    // Validate input data
    if (!Array.isArray(metrics) || metrics.some(m => 
      typeof m.carbon !== "number" || 
      typeof m.water !== "number" || 
      typeof m.waste !== "number" || 
      typeof m.year !== "string"
    )) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // Insert all metrics in a single transaction for efficiency
    const newMetrics = await prisma.metric.createMany({
      data: metrics.map(({ carbon, water, waste, year }) => ({
        userId,
        carbon,
        water,
        waste,
        year,
      })),
    });

    return NextResponse.json({ success: true, metrics: newMetrics }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
