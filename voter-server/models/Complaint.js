import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Can be 'Pending', 'In Progress', 'Resolved'
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Complaint", complaintSchema);
