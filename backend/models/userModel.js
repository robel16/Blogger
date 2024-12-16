const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User schema definition
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name:{
      type:String,
      required:false
    },
    avatar:{
      type:String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    role: {
      type: String,
      enum: ["User", "Editor"],
      default: "User",
    },
    totalPosts: {
      type: Number,
      default: 0, // Field to track the number of posts
    },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare the entered password with the stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update the totalPosts count
userSchema.methods.updateTotalPosts = async function () {
  // Increment the totalPosts field whenever a new post is created
  this.totalPosts += 1;
  await this.save();
};

// Export the User model
module.exports = mongoose.model("User", userSchema);
