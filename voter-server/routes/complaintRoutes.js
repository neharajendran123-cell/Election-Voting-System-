import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// Student files a complaint
router.post("/file", async (req, res) => {
  try {
    const { studentId, title, description } = req.body;
    const complaint = new Complaint({ studentId, title, description });
    await complaint.save();
    res.status(201).json({ message: "Complaint filed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error filing complaint" });
  }
});

// Admin gets all complaints
router.get("/all", async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("studentId", "name username");
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving complaints" });
  }
});

// Admin updates complaint status
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await Complaint.findByIdAndUpdate(req.params.id, { status });
    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
});


router.get("/student/:id", async (req, res) => {
    try {
      const complaints = await Complaint.find({ studentId: req.params.id });
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });
  
export default router;
