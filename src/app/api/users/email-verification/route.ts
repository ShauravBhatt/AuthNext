import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userSchema";
import { connectDb } from "@/database/dbConfig";
export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const body = await request.json();
    const token = body.token;

    if (!token) {
      return NextResponse.json({ error: "Token is not present" }, { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOneAndUpdate(
      {
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiry: {
          $gt: Date.now()
        }
      },
      {
        $set: {
          isVerified: true,
        },
        $unset: {
          emailVerificationToken: "",
          emailVerificationTokenExpiry: ""
        }
      },
      {
        returnDocument: "after",
      }
    )

    if (!user) {
      return NextResponse.json({ message: "Error occurred while email verification", success: false }, { status: 400 });
    }
    return NextResponse.json({ message: "Email Verification successful", success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error", success: false }, { status: 500 });
  }
}
