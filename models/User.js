import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
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
  profilePicture: {
    url: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
      default: "",
    },
  },
  resume: {
    resume_url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
    },
  },
  tech_stack: {
    type: [String],
    required: true,
  },
  field_of_interest: {
    type: String,
    required: true,
  },
  experience_level: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
