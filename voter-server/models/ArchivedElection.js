import mongoose from "mongoose";

const ArchivedElectionSchema = new mongoose.Schema({
  electionId: String,
  title: String,
  candidates: Array, // Store candidates and their votes
  nominations: Array, // Store all nomination requests
  totalVotes: Number,
  closedAt: { type: Date, default: Date.now },
});

const ArchivedElection = mongoose.model("ArchivedElection", ArchivedElectionSchema);

export default ArchivedElection;
