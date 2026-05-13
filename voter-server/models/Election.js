import mongoose from "mongoose";

const ElectionSchema = new mongoose.Schema({
 /* title: { type: String, required: true }*/
  status: {
    type: String,
    enum: ["ongoing", "not started", "Closed", "reset"],
    required: true,
    default: "not started"
  },
  startDate: Date,
  endTime: Date,
  nominationDeadline: { type: Date },
  positions: [{ type: String }],
  winners: [{
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
    firstname: String,
    lastname:String,
    position: String,
    votes: Number,
}]
});

export default mongoose.model("Election", ElectionSchema);
