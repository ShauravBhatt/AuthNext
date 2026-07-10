import User from "@/models/userSchema";
import { connectDb } from "@/database/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import generateRandomToken from "@/helpers/generateRandomToken";
import forgotPasswordMailgenContent from "@/templates/forgotPasswordMailgenTemplate"
import sendEmail from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const body = await request.json();

    const inputEmail = body?.email?.trim().toLowerCase();

    if (!inputEmail) {
      return NextResponse.json({ message: "User email not received", success: false }, { status: 400 });
    }

    const user = await User.findOne({ email: inputEmail }).select("-password -emailVerificationToken -emailVerificationTokenExpiry");

    if (!user) {
      return NextResponse.json({ message: "If the email exists, a reset link has been sent", success: false }, { status: 200 });
    }

    const { unhashedToken, hashedToken, expiresAt } = generateRandomToken(20);

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = expiresAt;

    await user.save();

    if (!process.env.PUBLIC_APP_URL) {
      throw new Error("PUBLIC_APP_URL is not defined");
    }

    await sendEmail({
      email: user.email,
      subject: "Please reset your password",
      mailgenContent: forgotPasswordMailgenContent(
        user.username,
        `${process.env.PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(unhashedToken)}`
      )
    });

    return NextResponse.json({ message: "Reset Password Email Sent Successfully", success: true }, { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ message: "Some error occurred while sending email", success: false }, { status: 500 });
  }
}

