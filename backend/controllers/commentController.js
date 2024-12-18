const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

// Get comments for a post
const getComments = async (req, res) => {
  try {
    console.log('Getting comments for post:', req.params.postId);
    
    // First find the post to get its comments array
    const post = await Post.findOne({ blog_id: req.params.postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log('Post comments array:', post.comments);

    // Find all comments that match the IDs in the post's comments array
    const comments = await Comment.find({
      _id: { $in: post.comments }
    }).populate('author', 'username avatar email')
      .sort({ createdAt: -1 });

    console.log('Found comments:', comments);
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a comment
const createComment = async (req, res) => {
  try {
    // First find the post
    const post = await Post.findOne({ blog_id: req.params.postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log('Request body:', req.body);
    console.log('User from request:', req.user);
    console.log('Post ID:', req.params.postId);

    // Validate required fields
    if (!req.body.text || !req.body.text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Create the comment
    const comment = new Comment({
      text: req.body.text.trim(),
      author: req.user._id,
      post: req.params.postId
    });

    // Save the comment first
    await comment.save();

    // Update post's comments array and increment comment count
    post.comments.push(comment._id);
    post.activity.total_comments = (post.activity.total_comments || 0) + 1;
    await post.save();

    // Populate author details before sending response
    await comment.populate('author', 'username avatar');

    console.log('Created comment:', comment);
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors ? Object.values(error.errors).map(e => e.message) : undefined
    });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this comment" });
    }

    comment.text = req.body.text;
    await comment.save();

    // Populate author details before sending response
    await comment.populate('author', 'username avatar');

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    // Update post's comment count
    await Post.findOneAndUpdate(
      { blog_id: comment.post },
      { $inc: { 'activity.total_comments': -1 } }
    );

    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment
};
