import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
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
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

const User = mongoose.model("user-infos", userModel);

export default User;
