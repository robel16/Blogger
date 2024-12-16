<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const posts = ref([]);
const isLoading = ref(true);
const error = ref(null);
const stats = ref({
  views: 0,
  followers: 0,
  interactions: 0
});

const fetchPosts = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:5000/api/posts/user/posts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    posts.value = response.data.data; // Update this line to match the response structure
  } catch (err) {
    console.error('Error fetching posts:', err);
    error.value = 'Failed to load posts';
  } finally {
    isLoading.value = false;
  }
};

const showDeletePopup = ref(false);
const postToDelete = ref(null);

const openDeletePopup = (post) => {
  postToDelete.value = post;
  showDeletePopup.value = true;
};

const closeDeletePopup = () => {
  postToDelete.value = null;
  showDeletePopup.value = false;
};

const confirmDelete = async () => {
  if (!postToDelete.value) return;
  
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`http://localhost:5000/api/posts/${postToDelete.value.blog_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Remove the deleted post from the posts array
    posts.value = posts.value.filter(post => post.blog_id !== postToDelete.value.blog_id);
    closeDeletePopup();
  } catch (err) {
    console.error('Error deleting post:', err);
    error.value = 'Failed to delete post';
  }
};

const editPost = (blogId) => {
  router.push(`/edit-post/${blogId}`);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(fetchPosts);
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <!-- Dashboard Layout -->
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 fixed h-full bg-white border-r border-gray-200 pt-8 hidden md:block">
        <nav class="px-4 space-y-1">
          <router-link
            to="/dashboard"
            class="flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg"
          >
            <i class="fi fi-rr-apps mr-3"></i>
            Dashboard
          </router-link>

          <router-link
            to="/create-post"
            class="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            <i class="fi fi-rr-file-edit mr-3"></i>
            Create Post
          </router-link>

          <router-link
            to="/profile"
            class="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            <i class="fi fi-rr-user mr-3"></i>
            Profile
          </router-link>

          <router-link
            to="/settings"
            class="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
          >
            <i class="fi fi-rr-settings mr-3"></i>
            Settings
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64 p-8">
        <div class="max-w-7xl mx-auto">
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-4">Total Posts</h3>
              <p class="text-3xl font-bold">{{ posts.length }}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-4">Published Posts</h3>
              <p class="text-3xl font-bold">
                {{ posts.filter(post => !post.draft).length }}
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-4">Draft Posts</h3>
              <p class="text-3xl font-bold">
                {{ posts.filter(post => post.draft).length }}
              </p>
            </div>
          </div>

          <!-- Posts List -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium">Your Posts</h2>
            </div>

            <div v-if="isLoading" class="p-6 text-center text-gray-500">
              Loading posts...
            </div>

            <div v-else-if="error" class="p-6 text-center text-red-500">
              {{ error }}
            </div>

            <div v-else-if="posts.length === 0" class="p-6 text-center text-gray-500">
              No posts found. <router-link to="/create-post" class="text-blue-500 hover:underline">Create your first post</router-link>
            </div>

            <div v-else class="divide-y divide-gray-200">
              <div v-for="post in posts" :key="post.blog_id" class="px-6 py-4 flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-medium mb-1">{{ post.title }}</h3>
                  <p class="text-sm text-gray-500">
                    {{ post.draft ? 'Draft' : 'Published' }} on {{ formatDate(post.publishedAt) }}
                  </p>
                </div>

                <div class="flex items-center space-x-4">
                  <button
                    @click="editPost(post.blog_id)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    <i class="fi fi-rr-edit text-lg"></i>
                  </button>
                  <button
                    @click="openDeletePopup(post)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <i class="fi fi-rr-trash text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Delete Confirmation Popup -->
    <div v-if="showDeletePopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Delete Post
        </h3>
        <p class="text-gray-500 mb-6">
          Are you sure you want to delete {{ postToDelete?.title }}? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="closeDeletePopup"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add animation for the popup */
.fixed {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Optional: Add transition for the popup background */
.bg-opacity-50 {
  transition: background-color 0.2s ease-in-out;
}
</style>