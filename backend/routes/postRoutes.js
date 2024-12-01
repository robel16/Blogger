const express = require("express");
const postController = require("./../controllers/postController");
const authController = require("./../middleware/authMiddleware"); // Ensure this points to your actual auth middleware file
const { protect } = require("./../middleware/authMiddleware");
const router = express.Router();

// Middleware for authentication on routes that require it

// Route to create a new post
router.post("/", protect, postController.createAPost);

// Route to get all published posts
router.get("/", postController.getAllPublishedPosts);

// Route to get a single published post by ID
router.get("/:postId", postController.getASinglePublishedPost);

// Route to update a post by ID
router.put("/:postId", protect, postController.updatePost);

// Route to delete a post by ID
router.delete("/:postId", protect, postController.deletePost);

module.exports = router;
