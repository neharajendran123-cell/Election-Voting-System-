import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
      const { firstname, lastname, year, department, mobile, gender, email, password, role } = req.body;
      
      if (!email.endsWith("@gcek.ac.in")) {
        return res.status(400).json({ message: "Only college emails are allowed" });
    }
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "Email already exists" });
      }

  
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
          firstname,
          lastname,
          year,
          department,
          mobile,
          gender,
          email,
          password: hashedPassword,
          role, // Should be "student" or "admin"
          hasVoted: false,
          isApproved: false // Requires admin approval
      });

      await newUser.save();
      res.status(201).json({ message: "Registration successful! Waiting for admin approval." });

  } catch (error) {
      console.error("Error in register route:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


// User Login
router.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;

   
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "User not found" });
      }


      if (user.role === "student" && !user.isApproved) {
          return res.status(403).json({ message: "Admin approval pending" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
      }

     
      const token = jwt.sign(
          { userId: user._id, role: user.role }, 
          "voters#", 
          { expiresIn: "1h" }
      );
      res.status(200).json({
        token,
        message: "Login successful",
        role: user.role,
        userId: user._id,
      });

    

  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});
//  Fetch Logged-in User Data (GET /api/auth/me)
router.get("/me", async (req, res) => {
  try {
    //  Extract JWT token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.get("/unapproved-students", async (req, res) => {
  try {
      const students = await User.find({ role: "student", isApproved: false });
      console.log("students are",students);
      res.json(students);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});
router.put("/approve/:id", async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.isApproved = true; // Mark student as approved
      await user.save();

      res.json({ message: "User approved successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});
router.get("/approved-students", async (req, res) => {
  try {
    const students = await User.find({ role: "student", isApproved: true });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/approved-users", async (req, res) => {
  try {
    const approvedUsers = await User.find({ isApproved: true });
    res.status(200).json(approvedUsers);
  } catch (err) {
    console.error("Error fetching approved users:", err);
    res.status(500).json({ message: "Server error while fetching approved users." });
  }
});


export default router;
