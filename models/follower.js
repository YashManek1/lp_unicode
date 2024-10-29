import mongoose from "mongoose";

const FollowerSchema = new mongoose.Schema({
  follower_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  following_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "following_type",
  },
  following_type: {
    type: String,
    enum: ["users", "company"],
    required: true,
  },
  following_date: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Follower", FollowerSchema);
