import { connectDb } from "@/database/dbConfig";
import User from "@/models/userSchema";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import generateRandomToken from "@/helpers/generateRandomToken";
import sendEmail from "@/helpers/mailer";
import emailVerificationMailgenContent from "@/templates/emailVerificationMailgenTemplate";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    const normalisedEmail = email.trim().toLowerCase();
    const normalisedUsername = username.trim();

    if (
      normalisedUsername.length == 0 ||
      normalisedEmail.length == 0 ||
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
        { username: normalisedUsername },
        { email: normalisedEmail },
      ],
    });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { unhashedToken, hashedToken, expiresAt } = generateRandomToken(20);

    const newUser = new User({
      username: normalisedUsername,
      email: normalisedEmail,
      password: hashedPassword,
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiry: expiresAt,
    });

    await newUser.save();

    await sendEmail({
      email: normalisedEmail,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailgenContent(
        `${process.env.PUBLIC_APP_URL}/verify-email/${unhashedToken}`,
        normalisedUsername

      )
    })

    return NextResponse.json(
      {
        message: "User created successfully",
      }, {
      status: 201,
    },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
