import mongoose from "mongoose";

const NominationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User",required: true, unique: true },
  firstname: { type: String, required: true }, // ✅ Store first name separately
  lastname: { type: String, required: true }, 
  year: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  cgpa: { type: String, required: true },
  document: { type: String, required: true }, // ID proof document path
  conductCertificate: { type: String, required: true }, // Conduct Certificate path
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"], // Only these values are allowed
    default: "Pending", // Default status when submitted
  }
});

const Nomination = mongoose.model("Nomination", NominationSchema);
export default Nomination; // ✅ Correct ES Module export
