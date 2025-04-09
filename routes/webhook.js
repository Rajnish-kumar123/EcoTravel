// routes/webhook.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Webhook route to handle Clerk user creation
router.post("/clerk-webhook", async (req, res) => {
  const { type, data } = req.body;

  if (type === "user.created") {
    const userId = data.id;
    const email = data.email_addresses?.[0]?.email_address || "No Email";
    const name = data.first_name + " " + data.last_name || "Unknown";

    try {
      const existingUser = await User.findOne({ clerkId: userId });
      if (!existingUser) {
        const newUser = new User({ clerkId: userId, email, name });
        await newUser.save();
        console.log("✅ User saved via Webhook");
      } else {
        console.log("⚠️ User already exists (Webhook)");
      }

      return res.status(200).json({ message: "User handled" });
    } catch (err) {
      console.error("❌ Webhook Error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  res.status(200).send("Ignored event type");
});

export default router;
