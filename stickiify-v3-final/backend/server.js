import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { loginHandler, loginRateLimiter } from "./auth/secureLoginRoute.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser());

app.post("/portal/login", loginRateLimiter, loginHandler);

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`Auth API listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});