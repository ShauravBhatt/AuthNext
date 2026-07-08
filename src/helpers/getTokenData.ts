import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

export default async function getTokenData(request: NextRequest) {
  try {
    const decodedToken = request.cookies.get("token")?.value || "";

    if (!decodedToken) {
      throw new Error("Invalid Token");
    }

    if (!process.env.TOKEN_SECRET) {
      throw new Error("Token secret is missing");
    }

    const token = jwt.verify(decodedToken, process.env.TOKEN_SECRET!) as JwtPayload;

    if (!token) {
      throw new Error("Invalid token secret");
    }

    return token._id;
  } catch (error: any) {
    throw new Error(error.message)
  }
}
