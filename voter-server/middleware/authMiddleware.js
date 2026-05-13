import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const verifyToken = async (req, res, next) => {
  try {
    // 🔹 Extract token from headers
    const token = req.header("Authorization")?.split(" ")[1]; // Format: "Bearer <token>"
    console.log("📌 Token received in backend:", token); 
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    // 🔹 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("📌 Decoded token:", decoded);
   // req.user = await User.findById(decoded._id).select("-password"); // Remove password field
   req.user = await User.findById(decoded.userId).select("-password"); // Use `userId`
  
    console.log("📌 Searching for user with ID:", decoded.userId);


    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next(); // Proceed to next middleware/route
  } catch (error) {
    res.status(401).json({ message: "Invalid token. Authorization denied." });
  }
};
