import mongoose from "mongoose";
import validator from "validator";

const RecruiterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(Value) {
      if (!validator.isEmail(Value)) {
        throw new error("Invalid email-id");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (
        !validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        throw new error("Enter a strong password");
      }
    },
  },
  join_date: {
    type: Date,
    default: Date.now(),
  },
  qualification: {
    type: String,
    required: true,
  },
  current_position: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
  },
  company_name: {
    type: String,
    required: true,
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
});

export default mongoose.model("Recruiter", RecruiterSchema);
