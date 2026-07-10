import User from "@/models/userSchema"
import { connectDb } from "@/database/dbConfig"
import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { newPassword, token } = body;

  if (!newPassword) {
    return NextResponse.json({ message: "Missing new password.", success: false }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ message: "Missing verification token.", success: false }, { status: 401 });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const securePassword = await bcrypt.hash(newPassword, 10);

  try {
    await connectDb();

    const user = await User.findOneAndUpdate(
      {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: {
          $gt: Date.now()
        }
      },
      {
        $set: {
          password: securePassword
        },
        $unset: {
          forgotPasswordToken: "",
          forgotPasswordTokenExpiry: "",
        }
      },
    )

    if (!user) {
      return NextResponse.json({ message: "Reset token is invalid or has expired", success: false }, { status: 400 });
    }

    const response = NextResponse.json({ message: "Password changed successfully", success: true }, { status: 200 });
    response.cookies.delete("token");

    return response;
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ message: "Error while making changes in db", success: false }, { status: 500 });
  }
}
