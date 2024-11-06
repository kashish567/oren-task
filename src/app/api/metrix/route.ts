

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

    // Get the metric data from the request body
    const { carbon, water, waste, year } = await req.json();

    console.log(carbon, water, waste, year);

    // Validate the input data
    if (typeof carbon !== "number" || typeof water !== "number" || typeof waste !== "number" || typeof year !== "string") {
        
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });

    }

    // Create a new metric and associate it with the user
    const newMetric = await prisma.metric.create({
      data: {
        userId,
        carbon,
        water,
        waste,
        year,
      },
    });

    // Respond with the newly created metric
    return NextResponse.json({ metric: newMetric, success: true }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
