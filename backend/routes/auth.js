// // backend/routes/auth.js
// const express = require("express");
// const { OAuth2Client } = require("google-auth-library");
// const User = require("../models/User"); // Adjust the path to your User model
// const router = express.Router();

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Your Google Client ID

// /**
//  * @route POST /api/auth/google-login
//  * @desc Google Sign-In endpoint
//  * @access Public
//  */
// router.post("/google-login", async (req, res) => {
//   const { idToken } = req.body; // Get the ID token from the request body

//   if (!idToken) {
//     return res.status(400).json({ message: "ID token is required" });
//   }

//   try {
//     // Verify the token with Google
//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture } = payload; // Get user info from the payload

//     // Check if the user already exists in the database
//     let user = await User.findOne({ email });
//     if (!user) {
//       // If the user does not exist, create a new user
//       user = new User({
//         username: name, // You can customize this as needed
//         email,
//         profilePicture: picture, // Store the user's profile picture
//       });
//       await user.save(); // Save the new user to the database
//     }

//     // Generate a token for the user (you can use JWT or any other method)
//     const token = generateToken(user._id, user.role); // Implement your token generation logic

//     // Respond with the user data and token
//     return res.status(200).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       profilePicture: user.profilePicture,
//       token,
//     });
//   } catch (error) {
//     console.error("Google login error:", error);
//     return res.status(400).json({ message: "Invalid Google token" });
//   }
// });

// module.exports = router;
