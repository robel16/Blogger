const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs")

// Generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, secret, {expiresIn ,algorithm: "HS256",});
};

  const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
      const userExists = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });

      if (userExists) {
        return res.status(400).json({ message: "User or email already exists" });
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword, // Save hashed password
        role,
      });

      await user.save();

      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Login user with password matching
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error("Login attempt with non-existent email:", email);
      return res
        .status(401)
        .json({ message: "Invalid credentials: User does not exist" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Password mismatch for user:", email);
      return res
        .status(401)
        .json({ message: "Invalid credentials: Incorrect password" });
    }

    // Generate token and respond
    const token = generateToken(user._id, user.role);
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { registerUser, loginUser,getUserData };
