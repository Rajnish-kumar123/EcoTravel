import express from "express";
import { clerkAuthMiddleware } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/save-user", clerkAuthMiddleware, async (req, res) => {
  const { email, firstName, lastName, clerkId } = req.body;

  try {
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = new User({
        email,
        firstName: firstName || "N/A",
        lastName: lastName || "N/A",
        clerkId,
      });
      await user.save();
      return res.status(201).json({ message: "User created", user });
    }

    res.status(200).json({ message: "User already exists", user });
  } catch (error) {
    console.error("Save user error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
