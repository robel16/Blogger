<template>
  <div class="min-h-screen bg-white">
    <Navigation :isAuthenticated="isAuthenticated" @logout="handleLogout" />
    
    <main class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1">
          <div class="border-b border-gray-200 mb-8">
            <nav class="-mb-px flex space-x-8">
              <a href="#" class="border-b-2 border-black px-1 py-4 text-sm font-medium">Home</a>
              <a href="#" class="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Following</a>
            </nav>
          </div>

          <div class="space-y-8">
            <div v-if="isLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p class="mt-4 text-gray-600">Loading articles...</p>
            </div>

            <div v-else-if="error" class="text-center py-8">
              <p class="text-red-500">{{ error }}</p>
              <button @click="fetchPosts" class="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                Try Again
              </button>
            </div>

            <template v-else>
              <article v-for="article in articles" :key="article._id" class="flex flex-col md:flex-row gap-6">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <img 
                      :src="defaultAvatar" 
                      alt="Author"
                      class="w-8 h-8 rounded-full object-cover"
                    />
                    <span class="text-sm">{{ article.author.username }} @ {{ formatDate(article.publishedAt) }}</span>
                  </div>
                  <h2 class="text-xl font-bold mb-2 hover:underline">
                    <router-link :to="`/post/${article._id}`">{{ article.title }}</router-link>
                  </h2>
                  <p class="text-gray-600 mb-4">{{ article.description }}</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div class="flex flex-wrap gap-2">
                        <span v-for="tag in article.tags" :key="tag" class="px-2 py-1 bg-gray-100 rounded-full text-sm">
                          {{ tag }}
                        </span>
                      </div>
                      <div class="flex items-center space-x-1 text-gray-500">
                        <i class="bx bx-heart"></i>
                        <span>{{ article.activity?.total_likes || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="md:w-48 h-32">
                  <img 
                    :src="article.banner || defaultPostImage"
                    :alt="article.title" 
                    class="w-full h-full object-cover rounded"
                    @error="e => e.target.src = defaultPostImage"
                  />
                </div>
              </article>
            </template>
          </div>
        </div>

        <!-- Right: Sidebar -->
        <div class="lg:w-80 space-y-8">
          <!-- Topics -->
          <div>
            <h3 class="text-base font-medium mb-4">Stories from all interests</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="tag in ['Programming', 'Technology', 'Jenkins', 'DevOps']"
                :key="tag"
                :class="[ 
                  'px-4 py-2 rounded-full text-sm', 
                  selectedCategory === tag.toLowerCase() 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                ]"
                @click="selectedCategory = tag.toLowerCase()"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Trending -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-medium">Trending</h3>
              <i class="bx bx-trending-up"></i>
            </div>
            <div class="space-y-4">
              <div v-for="(article, index) in articles.slice(0, 4)" :key="article._id" class="flex gap-4">
                <span class="text-3xl font-bold text-gray-200">0{{ index + 1 }}</span>
                <div>
                  <div class="flex items-center space-x-2 mb-1">
                    <img 
                      :src="defaultAvatar" 
                      alt="Author"
                      class="w-6 h-6 rounded-full object-cover"
                    />
                    <span class="text-sm">Author · {{ formatDate(article.publishedAt) }}</span>
                  </div>
                  <h4 class="font-bold">{{ article.title }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navigation from '../components/Navbar.vue'; // Import the Navbar component

const articles = ref([]);
const isLoading = ref(true);
const error = ref(null);
const selectedCategory = ref('all');
const isAuthenticated = ref(!!localStorage.getItem('token')); // Check if user is authenticated

// Fetch published posts from the backend
const fetchPosts = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get('http://localhost:5000/api/posts'); // Ensure this endpoint is correct
    console.log('API Response:', response.data);
    articles.value = Array.isArray(response.data.data.posts) ? response.data.data.posts : [];
  } catch (err) {
    console.error('Error fetching posts:', err);
    error.value = 'Failed to load articles';
  } finally {
    isLoading.value = false;
  }
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchPosts();
});
</script>

