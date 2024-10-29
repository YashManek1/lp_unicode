import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "shortlisted"],
    default: "pending",
  },
  applied_date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Application", ApplicationSchema);
