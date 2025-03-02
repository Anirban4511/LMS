// const express=require("express")
import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import connectDB from "./database/dbConnect.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config({});
//call database conncection
connectDB();
const app = express();

const PORT = 8000;
//default middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);
app.get("/home", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Hello I am coming from backend",
  });
});
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "This is the base url" });
});
app.listen(PORT, () => {
  console.log(`Server listen at PORT ${PORT}`);
});
