import mongoose from "mongoose";
import validator from "validator";

const CompanySchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true,
  },
  website_url: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
  },
});

export default mongoose.model("Company", CompanySchema);
