import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userSchema";
import { connectDb } from "@/database/dbConfig";
import getTokenData from "@/helpers/getTokenData";

export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const userId = await getTokenData(request);

    if (!userId) {
      return NextResponse.json({ error: "User id not found" }, { status: 400 });
    }

    const user = await User.findById(userId).select("-password -forgotPasswordToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordTokenExpiry");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User fetched successfully", data: user, success: true }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message , success: false}, { status: 500 });
  }
}
