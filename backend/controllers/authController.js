const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, secret, { expiresIn });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, profilePicture, isGoogleUser = false } = req.body;
    console.log("Received registration request:", { username, email, isGoogleUser });

    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (userExists) {
      console.log("User already exists:", userExists.email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      profilePicture,
      isGoogleUser
    });

    console.log("User created successfully:", user.email);

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      token
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: error.message || "Registration failed",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // For Google users, don't check password
    if (!user.isGoogleUser) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Verify token and get user data
const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user data error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserData };
