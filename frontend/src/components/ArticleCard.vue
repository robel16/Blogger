<!-- src/components/ArticleCard.vue -->
<script setup>
import { defineProps, computed, ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
});

// Add notification function
const showNotification = (message) => {
  window.alert(message); // You can replace this with a better notification system
};

// Check if user is logged in and get user data
const user = computed(() => {
  return auth.currentUser;
});

// Check if user is logged in
const isAuthenticated = computed(() => {
  return auth.isAuthenticated;
});

// Computed properties for safer data access
const articleData = computed(() => ({
  id: props.article?._id || '',
  title: props.article?.title || '',
  description: props.article?.description || '',
  author: {
    name: props.article?.author?.username || 'Anonymous',
    avatar: props.article?.author?.avatar || '/default-avatar.png',
    id: props.article?.author?._id || ''
  },
  tags: props.article?.tags || [],
  likes: props.article?.activity?.total_likes || 0,
  comments: props.article?.activity?.total_comments || 0,
  publishedAt: props.article?.publishedAt || new Date(),
  banner: props.article?.banner || '/default-image.jpg'
}));

const isCommentSidebarOpen = ref(false);
const comments = ref([]);
const newComment = ref('');
const editingComment = ref(null);
const editText = ref('');

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const toggleCommentSidebar = () => {
  isCommentSidebarOpen.value = !isCommentSidebarOpen.value;
  if (isCommentSidebarOpen.value) {
    fetchComments();
  }
};

const fetchComments = async () => {
  try {
    const postId = props.article.blog_id;
    console.log('Article data:', props.article); // Debug log
    console.log('Fetching comments for post:', postId);

    const response = await axios.get(
      `http://localhost:5000/api/comments/post/${postId}`
    );
    
    console.log('Fetched comments:', response.data);
    comments.value = response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    showNotification('Failed to load comments');
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) return;

  const token = localStorage.getItem('token');
  const currentUser = auth.user;

  if (!token || !currentUser) {
    showNotification('Please sign in to comment');
    window.location.href = '/signup';
    return;
  }

  try {
    const postId = props.article.blog_id;
    const commentData = { 
      text: newComment.value.trim(),
      author: currentUser._id
    };
    
    const response = await axios.post(
      `http://localhost:5000/api/comments/post/${postId}`,
      commentData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Add the author info to the new comment before adding to the list
    const newCommentWithAuthor = {
      ...response.data,
      author: {
        _id: currentUser._id,
        username: currentUser.username,
        avatar: currentUser.avatar
      }
    };
    
    comments.value.unshift(newCommentWithAuthor);
    newComment.value = '';
    
    if (props.article.activity) {
      props.article.activity.total_comments += 1;
    }
  } catch (error) {
    console.error('Error posting comment:', error);
    const errorMessage = error.response?.data?.message || 'Failed to post comment';
    showNotification(errorMessage);
  }
};

const startEdit = (comment) => {
  console.log('Starting edit for comment:', comment);
  editingComment.value = comment._id;
  editText.value = comment.text;
};

const cancelEdit = () => {
  editingComment.value = null;
  editText.value = '';
};

const updateComment = async (commentId) => {
  if (!editText.value.trim()) return;

  const token = localStorage.getItem('token');
  const currentUser = auth.user;

  if (!token || !currentUser) {
    showNotification('Please sign in to continue');
    window.location.href = '/signup';
    return;
  }

  try {
    console.log('Updating comment:', commentId, editText.value);
    
    const response = await axios.put(
      `http://localhost:5000/api/comments/${commentId}`,
      { text: editText.value.trim() },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Preserve the author information when updating the comment
    const updatedComment = {
      ...response.data,
      author: {
        _id: currentUser._id,
        username: currentUser.username,
        avatar: currentUser.avatar
      }
    };
    
    // Update the comment in the list
    const index = comments.value.findIndex(c => c._id === commentId);
    if (index !== -1) {
      comments.value[index] = updatedComment;
    }
    
    cancelEdit();
    showNotification('Comment updated successfully');
  } catch (error) {
    console.error('Error updating comment:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update comment';
    showNotification(errorMessage);
  }
};

const deleteComment = async (commentId) => {
  if (!confirm('Are you sure you want to delete this comment?')) return;

  const token = localStorage.getItem('token');
  if (!token) {
    showNotification('Please sign in to continue');
    window.location.href = '/signup';
    return;
  }

  try {
    console.log('Deleting comment:', commentId);
    
    await axios.delete(
      `http://localhost:5000/api/comments/${commentId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    // Remove the comment from the list
    comments.value = comments.value.filter(c => c._id !== commentId);
    
    // Update the comment count
    if (props.article.activity) {
      props.article.activity.total_comments -= 1;
    }
    
    showNotification('Comment deleted successfully');
  } catch (error) {
    console.error('Error deleting comment:', error);
    const errorMessage = error.response?.data?.message || 'Failed to delete comment';
    showNotification(errorMessage);
  }
};

const isCommentOwner = (comment) => {
  const currentUser = auth.user;
  console.log('Checking ownership:', { 
    currentUser: currentUser?._id, 
    commentAuthor: comment.author?._id 
  });
  
  if (!currentUser || !comment.author) {
    return false;
  }

  const isOwner = currentUser._id === comment.author._id;
  console.log('Is owner:', isOwner);
  return isOwner;
};
</script>

<template>
  <article class="flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-4 mb-4">
    <div class="flex-1">
      <!-- Author Info -->
      <div class="flex items-center space-x-2 mb-2">
        <img
          :src="articleData.author.avatar"
          :alt="articleData.author.name"
          class="w-8 h-8 rounded-full"
        />
        <router-link 
          :to="`/profile/${articleData.author.id}`" 
          class="text-sm font-medium hover:underline"
        >
          {{ articleData.author.name }}
        </router-link>
        <span class="text-sm text-gray-500">@ {{ formatDate(articleData.publishedAt) }}</span>
      </div>

      <!-- Title and Description -->
      <h2 class="text-xl font-bold mb-2 hover:underline">
        <router-link :to="`/article/${articleData.id}`">
          {{ articleData.title }}
        </router-link>
      </h2>
      <p class="text-gray-600 mb-4">
        {{ articleData.description }}
      </p>

      <!-- Tags and Interactions -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in articleData.tags" 
              :key="tag" 
              class="px-2 py-1 bg-gray-100 rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Interaction buttons -->
          <div class="flex items-center space-x-4">
            <!-- Like button -->
            <button class="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
              <span>❤️</span>
              <span>{{ articleData.likes }}</span>
            </button>
            
            <!-- Comment button -->
            <button 
              class="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
              @click="toggleCommentSidebar"
            >
              <span>💬</span>
              <span>{{ articleData.comments }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Article image -->
    <div class="md:w-48 h-32">
      <img
        :src="articleData.banner"
        :alt="articleData.title"
        class="w-full h-full object-cover rounded"
      />
    </div>

    <!-- Comment Sidebar -->
    <div 
      v-if="isCommentSidebarOpen"
      class="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto z-50"
    >
      <!-- Sidebar Header -->
      <div class="p-4 border-b border-gray-200 sticky top-0 bg-white">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Comments ({{ comments.length }})</h3>
          <button 
            @click="toggleCommentSidebar" 
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Comments List -->
      <div class="p-4 space-y-4">
        <!-- Add Comment Form - Only show if authenticated -->
        <form v-if="auth.isAuthenticated" @submit.prevent="submitComment" class="mb-6">
          <textarea
            v-model="newComment"
            placeholder="Write a comment..."
            class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            rows="3"
          ></textarea>
          <button 
            type="submit"
            class="mt-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            :disabled="!newComment.trim()"
          >
            Post Comment
          </button>
        </form>

        <!-- Sign in message if not authenticated -->
        <div v-else class="text-center py-4">
          <p class="text-gray-600">Please <a href="/signup" class="text-blue-600 hover:underline">sign in</a> to comment</p>
        </div>

        <!-- Comments -->
        <div v-if="comments.length > 0">
          <div v-for="comment in comments" :key="comment._id" class="border-b border-gray-100 pb-4 mb-4">
            <div class="flex items-start gap-3">
              <img 
                :src="comment.author?.avatar || '../assets/images/default-avatar.png'" 
                alt="User avatar" 
                class="w-8 h-8 rounded-full"
              />
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ comment.author?.username }}</span>
                    <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <!-- Edit/Delete buttons -->
                  <div v-if="isCommentOwner(comment)" class="flex items-center gap-2">
                    <button 
                      v-if="editingComment !== comment._id"
                      @click="startEdit(comment)"
                      class="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      @click="deleteComment(comment._id)"
                      class="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <!-- Edit form -->
                <div v-if="editingComment === comment._id" class="mt-2">
                  <textarea
                    v-model="editText"
                    class="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows="2"
                  ></textarea>
                  <div class="flex justify-end gap-2 mt-2">
                    <button 
                      @click="cancelEdit"
                      class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button 
                      @click="updateComment(comment._id)"
                      class="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <!-- Comment text (when not editing) -->
                <p v-else class="text-gray-700 mt-1">{{ comment.text }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No comments message -->
        <div v-else class="text-center py-4">
          <p class="text-gray-600">No comments yet</p>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div 
      v-if="isCommentSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="toggleCommentSidebar"
    ></div>
  </article>
</template>

<style scoped>
.router-link-active {
  @apply text-black;
}
</style>