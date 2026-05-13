import express from "express";
import Candidate from "../models/Candidate.js";
import User from "../models/UserModel.js";
import Election from "../models/Election.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Ensure authentication

const router = express.Router();


router.post("/", verifyToken, async (req, res) => {
  try {
    console.log("inside voting route")

    const { votes } = req.body; 
    console.log(votes)   
     const userId = req.user._id; 


    const election = await Election.findOne();
    if (!election || election.status !== "ongoing") {
      return res.status(400).json({ message: "Election is not ongoing." });
    }

   
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });
     

    if (user.hasVoted) {
      return res.status(400).json({ message: "You have already voted!" });
    }


    for (const position in votes) {
      const candidateId = votes[position];

      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ message: `Candidate for ${position} not found.` });
      }

      candidate.votes += 1;
      await candidate.save();
    }

    user.hasVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote submitted successfully!" });
  } catch (error) {
    console.error("Voting Error:", error);
    res.status(500).json({ message: "Server error while voting." });
  }
});


router.get("/results", verifyToken, async (req, res) => {
  try {
    
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

   
    const candidates = await Candidate.find({}, "firstname lastname position votes");
     console.log(candidates)
    if (!candidates || candidates.length === 0) {
      return res.status(200).json([]);
  }
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching vote results:", error);
    res.status(500).json({ message: "Server error while fetching results." });
  }
});

router.post("/declare-winners", verifyToken, async (req, res) => {
  try {
      if (req.user.role !== "admin") {
          return res.status(403).json({ message: "Access denied. Admins only." });
      }

      const election = await Election.findOne({ status: "Closed" }).sort({ createdAt: -1 });

      if (!election) {
          return res.status(400).json({ message: "No closed election found. Close the election first." });
      }

  
      const candidates = await Candidate.find({ electionId: election._id });

      if (!candidates.length) {
          return res.status(400).json({ message: "No candidates found for this election!" });
      }

      const winners = {};

      candidates.forEach(candidate => {
          const { position, votes } = candidate;
          if (!winners[position] || votes > winners[position].votes) {
              winners[position] = {
                  candidateId: candidate._id,
                  firstname: candidate.firstname,
                  lastname: candidate.lastname,
                  position: candidate.position,
                  votes: candidate.votes
              };
          }
      });

     
      election.winners = Object.values(winners);
      await election.save();

      res.status(200).json({ message: "Winners declared successfully!", winners: election.winners });

  } catch (error) {
      console.error("❌ Error declaring winners:", error);
      res.status(500).json({ message: "Server error while declaring winners." });
  }
});
router.get("/winners", verifyToken, async (req, res) => {
  try {
      const election = await Election.findOne();

      if (!election || !election.winners || election.winners.length === 0) {
          return res.status(404).json({ message: "Winners have not been declared yet." });
      }

      res.json(election.winners);
  } catch (error) {
      console.error("Error fetching winners:", error);
      res.status(500).json({ message: "Server error" });
  }
});


router.get("/public-results", verifyToken, async (req, res) => {
  try {
 
    const election = await Election.findOne({ status: "Closed" }).sort({ createdAt: -1 });

    if (!election) {
      return res.status(400).json({ message: "Election is not closed yet." });
    }

    
    const candidates = await Candidate.find({ electionId: election._id }, "firstname lastname position votes");

    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ message: "No candidates found." });
    }

    res.status(200).json(candidates);
  } catch (error) {
    console.error("❌ Error fetching public results:", error);
    res.status(500).json({ message: "Server error while fetching public results." });
  }
});

export default router;
