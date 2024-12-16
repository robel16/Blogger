const Comment = require("../models/commentModel");

// Get all comments for a post
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const newComment = new Comment({
      content,
      post: postId,
      user: req.user.id,
    });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
