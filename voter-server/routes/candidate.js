import express from "express";
import Candidate from "../models/Candidate.js"; // ✅ Import Candidate Model using ES Modules

const router = express.Router();

// ✅ Get all approved candidates
router.get("/candidates", async (req, res) => {
   try {
  const candidates = await Candidate.find({ status: "Approved" });
   console.log(candidates) // ✅ Fetch only approved candidates
    res.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Error fetching candidates" });
  }
});

export default router; // ✅ Export using ES Modules