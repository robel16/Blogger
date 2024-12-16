const Post = require("../models/postModel");
const User = require("./../models/userModel");

exports.createAPost = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("User from req.user:", req.user);

    // Destructure required fields from the request body
    const { title, description, tags, content, state = "draft" } = req.body; // Default state to "draft"

    // Ensure you're getting the author's username and ID from req.user
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found." });
    }

    const author = req.user.username || "Default Author"; // Adjust based on your user model
    const authorId = req.user.id; // Make sure this corresponds to your JWT token

    // Create the post using the data
    const post = await Post.create({
      blog_id: req.body.blog_id, // Ensure this is valid
      title: req.body.title,
      content: content, // Ensure content is passed correctly
      banner: req.body.banner,
      description: req.body.description,
      tags: req.body.tags,
      draft: req.body.draft,
      author: req.user.id, // Add the state here
    });
    console.log("New post created", post);

    // Update the user's posts array and totalPosts count
    const user = await User.findById(authorId);

    // Add the new post ID to the user's posts array
    user.posts.push(post._id);

    // Update the totalPosts count
    await user.updateTotalPosts(); // This will increment the totalPosts field

    console.log("User posts and totalPosts updated");

    res.status(201).json({
      status: "Success",
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: error.message });
  }
};

//get user posry
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ publishedAt: -1 }) // Sort by newest first
      .populate({
        path: "author",
        select: "username email",
      });

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: posts,
    });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch posts",
    });
  }
};

// Get all published posts
   exports.getAllPublishedPosts = async (req, res) => {
     try {
       const posts = await Post.find({ draft: false })
       .sort({ publishedAt: -1 })
  .populate({path:"author",select:"username"}); 
       res.status(200).json({
         status: "success",
         results: posts.length,
         data: {
           posts: posts,
         },
       });
     } catch (error) {
       console.error("Error fetching posts:", error);
       res.status(500).json({ message: "Error fetching posts" });
     }
   };

// Get a single published post by ID
exports.getASinglePublishedPost = async (req, res) => {
  try {
    const { postId } = req.params;
    console.log("Attempting to fetch post with blog_id:", postId); // Debug log

    if (!postId) {
      return res.status(400).json({
        status: "fail",
        message: "Post ID is required",
      });
    }

    const post = await Post.findOne({ blog_id: postId }).populate({
      path: "author",
      select: "username email",
    });

    if (!post) {
      console.log("No post found with blog_id:", postId);
      return res.status(404).json({
        status: "fail",
        message: "Post not found",
      });
    }

    console.log("Found post:", post); // Debug log

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    console.error("Error retrieving post:", err);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Update a post
//
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const updates = req.body;

    const post = await Post.findOne({ blog_id: postId.toString() });

    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found",
      });
    }

    // Check if the post belongs to the user
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You can only edit your own posts",
      });
    }

    // Update the post
    Object.assign(post, updates);
    await post.save();

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
// Delete a post
 exports.deletePost = async (req, res) => {
   try {
     const { postId } = req.params;

     // Find the post by blog_id instead of _id
     const post = await Post.findOne({ blog_id: postId });

     if (!post) {
       return res.status(404).json({
         status: "fail",
         message: "Post not found",
       });
     }

     // Check if the post belongs to the user
     if (post.author.toString() !== req.user.id) {
       return res.status(403).json({
         status: "fail",
         message: "You can only delete your own posts",
       });
     }

     // Delete the post
     await Post.deleteOne({ blog_id: postId });

     res.status(200).json({
       status: "success",
       message: "Post deleted successfully",
     });
   } catch (err) {
     console.error("Error deleting post:", err);
     res.status(500).json({
       status: "fail",
       message: err.message,
     });
   }
 };
