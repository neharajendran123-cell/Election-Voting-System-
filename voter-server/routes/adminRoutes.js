import express from "express";
import User from "../models/UserModel.js"; // Assuming your User model is in models/User.js
import Nomination from "../models/Nomination.js";
import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js"
import transporter from '../config/nodemailer.js'; 
import bcrypt from "bcrypt";
import multer from 'multer';
import path from 'path';

const router = express.Router();
 
// Route to get all registered students
router.get("/students", async (req, res) => {
  try {
    console.log("Fetching students..."); // Debugging log
    const students = await User.find({ role: "student" });
    console.log("Students fetched:", students); // Log fetched data
    res.json(students);
  } catch (error) {
    console.error("Admin Dashboard Error:", error); // Log full error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to get all nomination requests
router.get("/nominations", async (req, res) => {
  try {
    const nominations = await Nomination.find();
    res.json(nominations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// Route to approve/reject a nomination
router.put("/nominations/:id", async (req, res) => {
  try {
    console.log("🔹 Update Nomination Route Hit!")
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const nomination = await Nomination.findById(req.params.id).populate('user');
        

    console.log(nomination)
    if (!nomination) {
      return res.status(404).json({ message: "Nomination not found" });
    }
    
    
    nomination.status = status === "approved" ? "Approved" : "Rejected";
    await nomination.save();
    console.log("✅ Nomination status updated:", nomination);

if (status === "approved") {
  const user = nomination.user; // The populated User object
  const mailOptions = {
    from: 'neharajendran123@gmail.com', // Your email address
    to: user.email, // User's email from the populated User object
    subject: 'Your Nomination Status: Approved',
    text: `Dear ${nomination.firstname} ${nomination.lastname},\n\nYour nomination for the position of ${nomination.position} has been approved!\n\nBest regards,\nElection Committee`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

    return res.json({ message: `Nomination ${status} successfully!`, nomination });
  } catch (error) {
    console.error("❌ Error updating nomination:", error.message); // Log the error message
    console.error("Stack trace:", error.stack); // Log the stack trace for more detailed debugging

    return res.status(500).json({ message: "Server error", error: error.message }); // Return error details in response
  }
});
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find({ status: "Approved" });

    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ message: "No approved candidates found" });
    }

    // Grouping candidates by position
    const groupedCandidates = {};
    candidates.forEach((candidate) => {
      if (!groupedCandidates[candidate.position]) {
        groupedCandidates[candidate.position] = [];
      }
      groupedCandidates[candidate.position].push(candidate);
    });

    res.status(200).json(groupedCandidates);
  } catch (error) {
    console.error("❌ Error fetching candidates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.put("/set-nomination-deadline", async (req, res) => {
  try {
    const { deadline } = req.body; // Expecting a date in ISO format

    if (!deadline) {
      return res.status(400).json({ message: "Nomination deadline is required" });
    }

    let election = await Election.findOne();
    if (!election) {
      return res.status(400).json({ message: "No election found. Please declare an election first." });
    }

    election.nominationDeadline = new Date(deadline);
    await election.save();

    console.log("✅ New Deadline Set:", election.nominationDeadline.toISOString());

    res.json({ message: "Nomination deadline updated successfully", election });
  } catch (error) {
    console.error("Error updating nomination deadline:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.get("/approved", async (req, res) => {
  try {
    // Fetch nominations with "Approved" status
    const approvedNominations = await Nomination.find({ status: "Approved" });

    // Group candidates by position
    const groupedCandidates = approvedNominations.reduce((acc, nomination) => {
      const position = nomination.position;

      // If the position doesn't exist, initialize an empty array
      if (!acc[position]) {
        acc[position] = [];
      }

      // Push the candidate into the respective position array
      acc[position].push(nomination);
      return acc;
    }, {});

    res.json(groupedCandidates); // Send the grouped nominations by position
  } catch (error) {
    console.error("Error fetching nominations:", error);
    res.status(500).json({ error: "Error fetching nominations" });
  }
});
router.get('/election', async (req, res) => {
  try {
    // Fetch the election details from the database
    const election = await Election.findOne({ status: { $in: ["reset", "not started"] } });

    if (!election) {
      return res.status(404).json({ message: "No active or upcoming election found." });
    }

    // Return the election data
    return res.json(election);
  } catch (error) {
    console.error("❌ Error fetching election data:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});



router.post('/add-student', async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      department,
      year,
      mobile,
      gender,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      department,
      year,
      mobile,
      gender,
      role: "student",
      isApproved: true, //  Admin-approved directly
    });

    await newStudent.save();
    res.status(201).json({ message: "Student added and approved successfully" });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/electionDetails");
  },
  filename: function (req, file, cb) {
    cb(null, "election-details" + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload route
router.post("/upload-election-detail", upload.single("file"), (req, res) => {
  try {
    res.status(200).json({ message: "Election detail uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});
export default router;
