import express from "express";
import multer from "multer";
import Nomination from "../models/Nomination.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import User from "../models/UserModel.js";
import Election from "../models/Election.js";
const router = express.Router();


const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📂 Destination function called");
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log("📝 Saving file:", file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
 
router.post("/", upload.fields([{ name: "document" }, { name: "conductCertificate" }]), async (req, res) => {
  try {
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

 
    const registeredUser = await User.findById(userId);
    if (!registeredUser) return res.status(404).json({ message: "User not found" });
    
    const activeElection = await Election.findOne({ status: { $in: ["ongoing", "not started"] } });
 
    const currentTimeUTC = new Date().toISOString();
    const deadlineUTC = new Date(activeElection.nominationDeadline).toISOString();

    console.log(`🔍 Current Time: ${currentTimeUTC}, Deadline: ${deadlineUTC}`);

   
    if (currentTimeUTC > deadlineUTC) {
      return res.status(400).json({ message: "Nomination deadline has passed. No more nominations allowed!" });
    }


    const existingNomination = await Nomination.findOne({ user: userId });
    if (existingNomination) return res.status(400).json({ message: "❌ You have already submitted a nomination!" });

    const { position, cgpa } = req.body;

    const newNomination = new Nomination({
      user: userId,
      firstname: registeredUser.firstname,
      lastname: registeredUser.lastname,
      department: registeredUser.department,
      year: registeredUser.year,
      position,
      cgpa,
      document: req.files["document"] ? req.files["document"][0].path : null,
      conductCertificate: req.files["conductCertificate"] ? req.files["conductCertificate"][0].filename : null,
    });

    await newNomination.save();
    return res.json({ message: "✅ Nomination submitted successfully!" }); 

  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ message: "❌ Server error", error: error.message }); 
  }
});


export default router;
