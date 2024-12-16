const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract the token from the header
   token = token.split(" ")[1];

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach the decoded token payload to req.user
    console.log("User authenticated:", req.user);
    next();
  } catch (error) {
    console.error("Token verification error:", error.message); // Log token verification errors

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired. Please log in again.",
      });
    }

    res.status(401).json({
      message: "Invalid token. Access denied.",
    });
  }
};

module.exports = { protect };
