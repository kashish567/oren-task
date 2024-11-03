import connectDB from "@/db/db";
import User from "@/models/user.model";
import { NextResponse,NextRequest } from "next/server";
import jwt from "jsonwebtoken";


export const POST = async (req:NextRequest) => {
    connectDB();
    try{
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Please fill all fields" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        if(user.password !== password){
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!,{expiresIn: "1h"});

        return NextResponse.json({ token,success:true,email }, { status: 200 });


    
    }catch(error:any){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}   