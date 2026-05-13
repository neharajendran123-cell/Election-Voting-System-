import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  year: { type: String, required: true },
  department: { type: String, required: true },
  mobile: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student"], required: true },
  hasVoted: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false } // Added admin approval field
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
