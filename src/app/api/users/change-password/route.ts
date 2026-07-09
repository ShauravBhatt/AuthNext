import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/database/dbConfig";
import User from "@/models/userSchema";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all fields.",
        },
        { status: 400 }
      );
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password cannot be the same as the current password.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access.",
        },
        { status: 401 }
      );
    }

    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as JwtPayload;

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (
      user.changePasswordLockedUntil &&
      Date.now() < user.changePasswordLockedUntil.getTime()
    ) {
      return NextResponse.json(
        {
          success: false,
          locked: true,
          lockedUntil: user.changePasswordLockedUntil,
          message:
            "Too many failed attempts. Please try again after 5 minutes or use Forgot Password.",
        },
        { status: 429 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      user.changePasswordAttempts += 1;

      if (user.changePasswordAttempts >= 3) {
        user.changePasswordLockedUntil = new Date(
          Date.now() + 5 * 60 * 1000
        );

        user.changePasswordAttempts = 0;

        await user.save();

        return NextResponse.json(
          {
            success: false,
            locked: true,
            lockedUntil: user.changePasswordLockedUntil,
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
          attemptsLeft: 3 - user.changePasswordAttempts,
          message: `Current password is incorrect. ${
            3 - user.changePasswordAttempts
          } attempt(s) remaining.`,
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.changePasswordAttempts = 0;
    user.changePasswordLockedUntil = null;

    await user.save();

    const response = NextResponse.json(
      {
        success: true,
        message: "Password changed successfully. Please login again.",
      },
      { status: 200 }
    );

    response.cookies.delete("token");

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
