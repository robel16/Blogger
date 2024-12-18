<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const post = ref(null);
const loading = ref(true);
const error = ref(null);
const isCommentSidebarOpen = ref(false);
const comments = ref([]);
const newComment = ref('');

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/posts/${route.params.id}`);
    post.value = response.data.data;
    await fetchComments();
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load post';
  } finally {
    loading.value = false;
  }
});

const toggleCommentSidebar = () => {
  isCommentSidebarOpen.value = !isCommentSidebarOpen.value;
};

const fetchComments = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/comments/${post.value._id}`);
    comments.value = response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    alert('Failed to load comments');
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) return;

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to comment');
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:5000/api/comments/${post.value._id}`,
      { text: newComment.value },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    // Add the new comment to the list
    comments.value.unshift(response.data);
    newComment.value = '';
  } catch (error) {
    console.error('Error posting comment:', error);
    alert('Failed to post comment');
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchComments();
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-600">
      {{ error }}
    </div>

    <!-- Post Content -->
    <article v-else class="prose max-w-none">
      <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
      
      <!-- Author and Date -->
      <div class="flex items-center gap-4 mb-8 text-gray-600">
        <div class="flex items-center gap-2">
          <img 
            :src="post.author.profilePicture || '/default-avatar.png'" 
            :alt="post.author.username"
            class="w-10 h-10 rounded-full object-cover"
          />
          <span>{{ post.author.username }}</span>
        </div>
        <span>·</span>
        <time>{{ new Date(post.createdAt).toLocaleDateString() }}</time>
      </div>

      <!-- Tags -->
      <div class="flex gap-2 mb-8">
        <span 
          v-for="tag in post.tags" 
          :key="tag"
          class="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-xl text-gray-600 mb-8">
        {{ post.description }}
      </p>

      <!-- Main Content -->
      <div v-for="(block, index) in post.content.blocks" :key="index">
        <!-- Text Block -->
        <p v-if="block.type === 'paragraph'" v-html="block.data.text"></p>
        
        <!-- Header Block -->
        <component
          :is="`h${block.data.level}`"
          v-else-if="block.type === 'header'"
          v-html="block.data.text"
        ></component>
        
        <!-- Image Block -->
        <figure v-else-if="block.type === 'image'" class="my-8">
          <img 
            :src="block.data.file.url" 
            :alt="block.data.caption"
            class="rounded-lg shadow-lg"
          />
          <figcaption v-if="block.data.caption" class="text-center text-gray-600 mt-2">
            {{ block.data.caption }}
          </figcaption>
        </figure>

        <!-- List Block -->
        <ul v-else-if="block.type === 'list' && block.data.style === 'unordered'" class="list-disc pl-6">
          <li v-for="(item, i) in block.data.items" :key="i" v-html="item"></li>
        </ul>
        <ol v-else-if="block.type === 'list' && block.data.style === 'ordered'" class="list-decimal pl-6">
          <li v-for="(item, i) in block.data.items" :key="i" v-html="item"></li>
        </ol>

        <!-- Code Block -->
        <pre v-else-if="block.type === 'code'" class="bg-gray-900 text-white p-4 rounded-lg">
          <code>{{ block.data.code }}</code>
        </pre>
      </div>
    </article>

    <!-- Add comment button (fixed position) -->
    <button 
      @click="toggleCommentSidebar"
      class="fixed bottom-8 right-8 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
    >
      <i class="fi fi-rr-comment"></i>
      <span>Comments ({{ comments.length }})</span>
    </button>

    <!-- Comment Sidebar -->
    <div 
      class="fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto"
      :class="isCommentSidebarOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Sidebar Header -->
      <div class="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Comments ({{ comments.length }})</h3>
          <button @click="toggleCommentSidebar" class="text-gray-500 hover:text-gray-700">
            <i class="fi fi-rr-cross"></i>
          </button>
        </div>
      </div>

      <!-- Comments List -->
      <div class="p-4 space-y-4">
        <!-- Add Comment Form -->
        <form @submit.prevent="submitComment" class="mb-6">
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

        <!-- Comments -->
        <div v-for="comment in comments" :key="comment._id" class="border-b border-gray-100 pb-4">
          <div class="flex items-start gap-3">
            <img 
              :src="comment.author.avatar || '/default-avatar.png'" 
              alt="User avatar" 
              class="w-8 h-8 rounded-full"
            />
            <div>
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ comment.author.username }}</span>
                <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <p class="text-gray-700 mt-1">{{ comment.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.prose img {
  @apply max-w-full h-auto;
}
</style> 