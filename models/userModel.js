import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    default: 'admin',
  }
},{timestamps: true});
export default mongoose.models.Users || mongoose.model("Users", userSchema)