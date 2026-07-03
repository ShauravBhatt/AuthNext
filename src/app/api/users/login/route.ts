import { connectDb } from "@/database/dbConfig";
import User from "@/models/userSchema";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const identifier = email.toLowerCase().trim();
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
      },
      process.env.TOKEN_SECRET!,
      {
        expiresIn: process.env.TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
      },
    );

    const response = NextResponse.json({
      message: "Login Successfull",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
