import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
dotenv.config()
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate a reset token (valid for 1 hour)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Store the reset token in the database
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Create a reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log(resetLink);

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>
             <p>This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Password reset link sent to your email" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to send reset email" });
  }
};

/**
 * ✅ Reset Password - Updates User Password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, resetToken: token });

    if (!user || user.resetTokenExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset token fields
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user is already exist with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //extract the public id of the old image from the url if it's exists
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0]; //extract the public id
      deleteMediaFromCloudinary(publicId);
    }

    //upload new or latest photo
    const cloudResponse = await uploadMedia(profilePhoto.path);
    if (!cloudResponse || !cloudResponse.secure_url) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }
    const photoUrl = cloudResponse.secure_url;
    const updateData = { name, photoUrl };
    const updatedUser=await User.findByIdAndUpdate(userId,updateData,{new:true}).select("-password")
    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
