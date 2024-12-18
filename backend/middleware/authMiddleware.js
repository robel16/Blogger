const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract the token
    token = token.split(" ")[1];
    console.log('Received token:', token); // Debug log

    try {
      // Verify the token
      const decoded = jwt.verify(token, secret);
      console.log('Decoded token:', decoded); // Debug log

      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token has expired. Please log in again.",
        });
      }
      return res.status(401).json({
        message: "Invalid token. Access denied.",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = { protect };