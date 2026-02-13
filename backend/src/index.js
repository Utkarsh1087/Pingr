import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import groupRoutes from "./routes/group.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
app.get("/", (req, res) => {
  res.send("Pingr Backend is Running 🚀");
});


const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
const isProduction = process.env.NODE_ENV?.trim() === "production";

console.log("--- Server Configuration ---");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("isProduction:", isProduction);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("----------------------------");

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: isProduction ? process.env.FRONTEND_URL : "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
