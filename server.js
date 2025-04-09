import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { User } from './models/User.js';
import webhookRoutes from "./routes/webhook.js";

dotenv.config();

const app = express(); // ✅ app ko sabse pehle initialize karo

// ✅ Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Clerk Middleware
app.use(
  ClerkExpressWithAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

// ✅ Webhook Routes (ab yahan lagao, jab app ban chuka ho)
app.use("/api/webhooks", webhookRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// ✅ Protected route
app.get('/api/protected', (req, res) => {
  if (req.auth?.userId) {
    res.json({ message: 'You are authenticated!', userId: req.auth.userId });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// ✅ Public route
app.get('/', (req, res) => {
  res.send('Welcome to the server! 🚀');
});

// ✅ Save user to MongoDB
app.post('/api/save-user', async (req, res) => {
  try {
    const { firstName, lastName, email, clerkId } = req.body;

    const existingUser = await User.findOne({ clerkId });

    if (existingUser) {
      return res.json({ message: 'User already exists', user: existingUser });
    }

    const newUser = new User({ firstName, lastName, email, clerkId });
    await newUser.save();

    res.json({ message: 'User saved successfully', user: newUser });
  } catch (error) {
    console.error('❌ Error saving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
