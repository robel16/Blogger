// models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    post: {
      type: String,
      required: true,
      index: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

commentSchema.pre('save', function(next) {
  console.log('Saving comment:', {
    text: this.text,
    author: this.author,
    post: this.post
  });
  next();
});

module.exports = mongoose.model("Comment", commentSchema);
