import jwt from "jsonwebtoken";
import crypto, { createHash } from "crypto";

// Generate a new token that is valid for 3hrs only
export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });
  return token;
};

// Generate salt for more secure password storage
export function genSalt() {
  return crypto.randomBytes(16).toString("base64");
}

// Hash password (user's plaintext password + generated salt)
export function genHash(password, salt) {
  return createHash("sha256")
    .update(password)
    .update(createHash("sha256").update(salt, "utf8").digest("hex"))
    .digest("hex");
}
