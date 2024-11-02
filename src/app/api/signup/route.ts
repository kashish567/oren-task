import connectDB from "@/db/db";
import User from "@/models/user.model";
import { NextResponse,NextRequest } from "next/server";


export const POST = async (req:NextRequest) => {
    connectDB();
    try{
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Please fill all fields" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const user = await User.create({ email, password });

        return NextResponse.json({ email: user.email });

    
    }catch(error:any){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}   