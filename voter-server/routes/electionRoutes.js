import express from "express";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Nomination from "../models/Nomination.js";
import ArchivedElection from "../models/ArchivedElection.js"; // Create this model
import User from "../models/UserModel.js"; //  Add this line


const router = express.Router();

router.post("/declare-election", async (req, res) => {
  try {
    const { status } = req.body; // "ongoing" or "not started"

    let election = await Election.findOne();
    // if (!election) {
    //   election = new Election({ status });
    // } else {
    //   election.status = status;
    // }
    if (!election) {
        election = new Election({
            status: "ongoing",
            startDate: new Date(), //  Fix: Store current date
        });
    } else {
        election.status = "ongoing";
        election.startDate = new Date(); //  Fix: Update start date
    }
    await election.save();
     
    const approvedNominees = await Nomination.find({ status: 'Approved' });

    if (approvedNominees.length === 0) {
      return res.status(400).json({ message: 'No approved nominees to add as candidates.' });
    }

    //  Insert them into the Candidate schema
    const candidates = approvedNominees.map(nominee => ({
      firstname: nominee.firstname,
      lastname: nominee.lastname,
      year: nominee.year,
      department: nominee.department,
      position: nominee.position,
      document: nominee.document,
      status: "Approved",
      electionId: election._id // Assign electionId
    }));

    await Candidate.insertMany(candidates); // Bulk insert into Candidate schema

    //console.log(" Candidates Updated with Election ID:", updatedCandidates);


    res.status(200).json({ message: `Election status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to get election status
router.get("/election-status", async (req, res) => {
  try {
    const election = await Election.findOne();
    //res.status(200).json({ status: election ? election.status : "not started" });
    if (!election) {
        return res.status(404).json({ message: "No election found" });
    }
    res.json({
        status: election.status,
        startDate: election.startDate, // Send start date
        endTime: election.endTime // Send end time
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/close", async (req, res) => {
    try {
      const election = await Election.findOne(); // Assuming only one election exists
      if (!election) {
        return res.status(404).json({ message: "No election found" });
      }
  
      election.status = "Closed";
      election.endTime = new Date(); // Store closing time
      await election.save();
  
      res.json({ message: "Election has been closed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  router.post("/add-position", async (req, res) => {
    try {
      const { position } = req.body;
      
      let election = await Election.findOne();
      if (!election) {
        election = new Election({ positions: [position] });
      } else {
        if (election.positions.includes(position)) {
          return res.status(400).json({ message: "Position already exists" });
        }
        election.positions.push(position);
      }
  
      await election.save();
      res.status(200).json({ message: "Position added successfully", positions: election.positions });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  router.post("/reset", async (req, res) => {
    try {
        console.log("🚀 Reset election started...");

        const election = await Election.findOne({ status: "Closed" }); // 🛠️ Ensure only closed elections are reset
        if (!election) {
            console.log("⚠️ No closed election found.");
            return res.status(400).json({ message: "No closed election found." });
        }

        console.log(" Found closed election:", election);

        // Archive election data
        const candidates = await Candidate.find();
        const nominations = await Nomination.find();
        const user = await User.find();
        const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

        const archivedElection = new ArchivedElection({
          electionId: election._id,
          title: election.title || "Unnamed Election", //  Handle missing title
          candidates: candidates.length > 0 
              ? candidates.map((c) => ({ name: c.name, votes: c.votes })) 
              : [], //  Ensure it does not break if empty
          nominations: nominations || [], //  Prevents undefined error
          totalVotes: totalVotes || 0, //  Ensures totalVotes is always a number
      });
      
        await archivedElection.save();

        // Clear active collections
        await Candidate.deleteMany({});

       // await User.deleteMany({});
        await Nomination.deleteMany({});
        await Election.updateMany({}, { $set: { status: "not started", winners: []}}); // Instead of deleting
       // await User.deleteMany({});
       await User.deleteMany({ role: "student" });

        // Reset the hasVoted field for all users
       // await User.updateMany({}, { $set: { hasVoted: false } });

        console.log("Election reset successfully.");
        res.json({ message: "Election reset successfully, data archived." });
    } catch (error) {
        console.error("❌ Error resetting election:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


export default router;
