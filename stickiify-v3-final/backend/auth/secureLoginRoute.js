import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { User } from "../models/User.js";

const INVALID_LOGIN_MESSAGE = "Invalid username or password";

// This hash is for a random password string and is intentionally not tied to a real user.
// It makes the "user not found" path still pay bcrypt's comparison cost.
// Generate your own once with: await bcrypt.hash("not-a-real-password", 12)
const DUMMY_PASSWORD_HASH =
  "$2b$12$kXh7OcnHUxX1AKe.Q6/rZuD5QfkHy4Aj70RuJ0k1l6mtvbcgG8dlK";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: INVALID_LOGIN_MESSAGE },
});

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function signAuthToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
      issuer: "stickiify-eg-api",
      audience: "stickiify-eg-web",
    }
  );
}

/**
 * POST /portal/login
 * Body: { username: string, password: string }
 *
 * Security guarantees:
 * - Same public error for missing user and wrong password.
 * - Dummy bcrypt.compare() when user is not found to reduce timing leaks.
 * - JWT is issued only after user exists AND password matches stored hash.
 * - Internal DB/config errors are logged server-side only.
 */
export async function loginHandler(req, res) {
  const username = normalizeUsername(req.body?.username);
  const password = String(req.body?.password || "");

  // Keep validation generic to avoid turning missing fields into an oracle.
  if (!username || !password) {
    await bcrypt.compare(password || "missing-password", DUMMY_PASSWORD_HASH);
    return res.status(401).json({ message: INVALID_LOGIN_MESSAGE });
  }

  try {
    const user = await User.findOne({ usernameNormalized: username })
      .select("+passwordHash username role")
      .lean();

    const hashToCompare = user?.passwordHash || DUMMY_PASSWORD_HASH;
    const passwordMatches = await bcrypt.compare(password, hashToCompare);

    // Critical: only authenticate when BOTH are true.
    if (!user || !passwordMatches) {
      return res.status(401).json({ message: INVALID_LOGIN_MESSAGE });
    }

    const token = signAuthToken(user);

    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    // Log details internally; never expose DB/config details to clients.
    console.error("Login failed internally", error);
    return res.status(500).json({ message: "Login temporarily unavailable" });
  }
}