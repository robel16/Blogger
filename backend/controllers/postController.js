const Post = require("../models/postModel");
const User = require("./../models/userModel");

// Create a new post
// exports.createAPost = async (req, res) => {
//   console.log("request Body", req.body);
//   try {
//     const { title, description, tags, body } = req.body;
// const author = req.user.username;
// const authorId= req.user._id
//     // Calculate read time
//     const wpm = 225; // Average reading speed
//     const numberOfWords = body.trim().split(/\s+/).length;
//     const readTime = Math.ceil(numberOfWords / wpm);

//     // Create post object
//     const post = await Post.create({
//       title,
//       description,
//       tags,
//       body,
//       author: req.user.username,
//       authorId: req.user._id,
//       readTime,
//     });

//     // Add post ID to user's posts array
//     await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });

//     res.status(201).json({
//       status: "success",
//       data: {
//         post,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ status: "fail", message: err.message });
//   }
// };

exports.createAPost = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("User from req.user:", req.user);

    // Destructure required fields from the request body
    const { title, description, tags, body, state = "draft" } = req.body; // Default state to "draft"

    // Ensure you're getting the author's username and ID from req.user
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found." });
    }

    const author = req.user.username || "Default Author"; // Adjust based on your user model
    const authorId = req.user.id; // Make sure this corresponds to your JWT token

    // Create the post using the data
    const post = await Post.create({
      title,
      description,
      tags,
      body,
      author, // Use the extracted author from req.user
      authorId,
      state, // Add the state here
    });
    console.log("new post created", post);

    await User.findByIdAndUpdate(
      authorId, 
      { $push: { posts: post._id } }, // Push the new post's ID into the posts array
      { new: true, useFindAndModify: false } // Options to return the updated document and avoid deprecation warnings
    );
    console.log("updated");
    res.status(201).json({
      status: "Success",
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
};

// Get all published posts
exports.getAllPublishedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ state: "published" });

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// Get a single published post
// exports.getASinglePublishedPost = async (req, res) => {
//   try {
//     const post = await Post.findOne({
//       _id: req.params.postId,
//       state: "published",
//     });
//     if (!post) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Post not found",
//       });
//     }

//     // Increment read count
//     post.readCount++;
//     await post.save();

//     res.status(200).json({
//       status: "success",
//       data: {
//         post,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ status: "fail", message: err.message });
//   }
// };

// Get a single published post by ID
exports.getASinglePublishedPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId, // Ensure you're using _id for querying
      state: "published", // Only fetch if the state is published
    });

    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found",
      });
    }

    // Increment the read count
    post.readCount++;
    await post.save();

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    console.error("Error retrieving post:", err);
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// Update a post
// exports.updatePost = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { title, description, tags, body, state } = req.body;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Post not found",
//       });
//     }
//     console.log("Post authorId:", post.authorId);
//     console.log("User _id:", req.user._id);
//     console.log(
//       "Are IDs equal?",
//       post.authorId.toString() === req.user._id.toString()
//     );

//     // Check if the post belongs to the user
//     if (post.authorId.toString() !== req.user._id) {
//       return res.status(403).json({
//         status: "fail",
//         message: "You can only update your own posts",
//       });
//     }

//     // Update post
//     post.title = title || post.title;
//     post.description = description || post.description;
//     post.tags = tags || post.tags;
//     post.body = body || post.body;
//     post.state = state || post.state;

//     await post.save();

//     res.status(200).json({
//       status: "success",
//       data: {
//         post,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ status: "fail", message: err.message });
//   }
// };
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description, tags, body, state } = req.body;

    console.log("req.user:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "fail",
        message: "User not authenticated",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found",
      });
    }

    console.log("Post:", post);
    console.log("Post authorId:", post.authorId);
    console.log("User id:", req.user.id);

    // Check if authorId exists on the post
    if (!post.authorId) {
      return res.status(400).json({
        status: "fail",
        message: "Post does not have an authorId",
      });
    }

    // Ensure both IDs are strings before comparison
    const postAuthorIdString = post.authorId.toString();
    const userIdString = req.user.id.toString();

    console.log("Post authorId (string):", postAuthorIdString);
    console.log("User id (string):", userIdString);
    console.log("Are IDs equal?", postAuthorIdString === userIdString);

    // Check if the post belongs to the user
    if (postAuthorIdString !== userIdString) {
      return res.status(403).json({
        status: "fail",
        message: "You can only update your own posts",
      });
    }

    // Update post
    post.title = title || post.title;
    post.description = description || post.description;
    post.tags = tags || post.tags;
    post.body = body || post.body;
    post.state = state || post.state;

    await post.save();

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ status: "fail", message: err.message });
  }
};
// Delete a post
// exports.deletePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId);
//     if (!post) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Post not found",
//       });
//     }

//     // Check if the post belongs to the user
//     if (post.authorId.toString() !== req.user._id) {
//       return res.status(403).json({
//         status: "fail",
//         message: "You can only delete your own posts",
//       });
//     }

//     await post.remove();

//     res.status(204).json({
//       status: "success",
//       message: "Post deleted successfully",
//     });
//   } catch (err) {
//     res.status(500).json({ status: "fail", message: err.message });
//   }
// };

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    console.log("req.user:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "fail",
        message: "User not authenticated",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found",
      });
    }

    console.log("Post:", post);
    console.log("Post authorId:", post.authorId);
    console.log("User id:", req.user.id);

    // Check if authorId exists on the post
    if (!post.authorId) {
      return res.status(400).json({
        status: "fail",
        message: "Post does not have an authorId",
      });
    }

    // Ensure both IDs are strings before comparison
    const postAuthorIdString = post.authorId.toString();
    const userIdString = req.user.id.toString();

    console.log("Post authorId (string):", postAuthorIdString);
    console.log("User id (string):", userIdString);
    console.log("Are IDs equal?", postAuthorIdString === userIdString);

    // Check if the post belongs to the user
    if (postAuthorIdString !== userIdString) {
      return res.status(403).json({
        status: "fail",
        message: "You can only delete your own posts",
      });
    }
    await User.findByIdAndUpdate(
      req.user.id, // Find the user by their ID
      { $pull: { posts: postId } }, // Remove the post's ID from the posts array
      { new: true, useFindAndModify: false } // Options to return the updated document and avoid deprecation warnings
    );

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ status: "fail", message: err.message });
  }
};
