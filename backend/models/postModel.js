const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  blog_id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  banner: {
    type: String,
    default: null
  },
  description: {
    type: String,
    max_length: 200
  },
  content: {
    type: Object,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activity: {
    total_likes: {
      type: Number,
      default: 0
    },
    total_comments: {
      type: Number,
      default: 0
    },
    total_reads: {
      type: Number,
      default: 0
    },
    total_parent_comments: {
      type: Number,
      default: 0
    }
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  draft: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'publishedAt'
  }
});

// Update user's activity 
postSchema.post('save', async function() {
  const User = mongoose.model('User');
  const user = await User.findById(this.author);
  if (user) {
    await user.updateTotalPosts();
  }
});

module.exports = mongoose.model('Post', postSchema);