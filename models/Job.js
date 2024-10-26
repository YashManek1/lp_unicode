import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  requirements: {
    type: [String],
    required: true,
  },
  salary_range: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  job_type: {
    type: String,
    enum: ["full-time", "part-time", "remote"],
    required: true,
  },
  recruiter_name: {
    type: String,
    required: true,
  },
  recruiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
  },
  company_name: {
    type: String,
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
});

export default mongoose.model("Job", JobSchema);
