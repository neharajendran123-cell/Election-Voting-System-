import mongoose from "mongoose";


const uri = "mongodb+srv://neharajendran123:Hello@voter-cluster.nm3w6.mongodb.net/voter-db?retryWrites=true&w=majority&appName=voter-cluster";

mongoose.connect(uri)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
