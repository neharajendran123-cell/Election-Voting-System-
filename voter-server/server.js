import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import selfNominationRoutes from "./routes/selfNominationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import candidate from "./routes/candidate.js";
import electionRoutes from "./routes/electionRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";


const router = express.Router();

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

console.log(" OTP Routes Loaded");
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static("uploads"));
// Middleware
app.use("/api/self-nomination", selfNominationRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api", candidate);
app.use("/api/election", electionRoutes);
app.use("/api/election-voting", selfNominationRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/election", electionRoutes); // Ensure this is present
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


