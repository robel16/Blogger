const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Log the incoming request body
    console.log("Authenticated User:", req.user); // Log the authenticated user

    const { postId, text } = req.body;
    const userId = req.user.id; // Use req.user.id if that's the structure

    // Check if userId is defined
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create and save the new comment with the author ID
    const newComment = await Comment.create({
      text,
      author: userId, // Set the author to the current user's ID
      post: postId,
    });

    // Add the comment ID to the post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error); // Log any errors
    res.status(500).json({ message: error.message });
  }
};

// Edit an existing comment

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    // Ensure the user owns the comment or has editor role
    if (!comment.author.equals(req.user._id) && req.user.role !== "editor") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    // Remove the comment from the post as well
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
