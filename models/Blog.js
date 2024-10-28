import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "Author_type",
    required: true,
  },
  author_type: {
    type: String,
    enum: ["users", "company"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Blog", BlogSchema);
