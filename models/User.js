// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
});

export const User = mongoose.model('User', userSchema);

export default User;

