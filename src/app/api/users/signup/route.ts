import { connectDb } from "@/database/dbConfig";
import User from "@/models/userSchema";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (
      username.trim().length == 0 ||
      email.trim().length == 0 ||
      password.trim().length == 0
    ) {
      return NextResponse.json(
        { error: "Invalid input received" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      $or: [
        { username: username.trim() },
        { email: email.toLowerCase().trim() },
      ],
    });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully", success: true },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
