import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  year: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  document: { type: String, required: true }, // ID proof document pat
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"], 
    default: "Approved", // ✅ Only store approved candidates here
  },
 // ✅ Add this,
  votes: { type: Number, default: 0 }, // ✅ Track votes for election
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
});

const Candidate = mongoose.model("Candidate", CandidateSchema);
export default Candidate;
