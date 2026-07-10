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

    if (!email) {
      return NextResponse.json({ message: "Email is missing", success: false }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ message: "Password is missing", success: false }, { status: 400 });
    }

    const identifier = email.toLowerCase().trim();
    const user = await User.findOne({ email: identifier });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 404 });
    }

    if (user.loginLockedUntil && (Date.now() < user.loginLockedUntil.getTime())) {
      return NextResponse.json(
        {
          success: false,
          locked: true,
          lockedUntil: user.loginLockedUntil,
          message:
            "Too many failed attempts. Please try again after 5 minutes or use Forgot Password.",
        },
        { status: 429 }
      )
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 3) {
        user.loginLockedUntil = new Date(Date.now() + 5 * 60 * 1000);

        user.loginAttempts = 0;

        await user.save();

        return NextResponse.json(
          {
            success: false,
            locked: true,
            lockedUntil: user.loginLockedUntil,
            message:
              "Too many failed attempts. Please try again after 5 minutes or use Forgot Password.",
          },
          { status: 429 }
        );
      }

      await user.save();

      return NextResponse.json(
        {
          success: false,
          locked: false,
          attemptsLeft: 3 - user.loginAttempts,
          message: `Current password is incorrect. ${3 - user.loginAttempts} attempt(s) remaining.`,
        },
        { status: 400 }

      )
    }

    user.loginAttempts = 0;
    user.loginLockedUntil = null;

    user.save();

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
      message: "Login Successful",
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
