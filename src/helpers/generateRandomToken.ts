import crypto from "crypto";

export default function generateRandomToken(minutes: number) {
  const unhashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
  return { unhashedToken, hashedToken, expiresAt };
}
