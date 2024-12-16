<template>
  <div class="bg-white">
    <nav class="border-b border-gray-200 bg-white fixed w-full top-0 z-50">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex-shrink-0">
            <h1 class="text-2xl font-bold text-gray-800">Blogger</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/write" class="hidden md:flex items-center space-x-1 text-gray-700 hover:text-gray-900">
              <i class="bx bx-edit"></i>
              <span>Write</span>
            </router-link>
            <router-link to="/signup" class="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Get started</router-link>
          </div>
        </div>
      </div>
    </nav>

    <header class="max-w-screen-md mx-auto px-4 sm:px-6 pt-24 pb-8">
      <div class="flex items-center space-x-4 mb-6">
        <img :src="post.author.avatar" alt="Author" class="w-16 h-16 rounded-full" />
        <div>
          <h2 class="font-medium">{{ post.author.name }}</h2>
          <div class="flex items-center text-sm text-gray-500 space-x-2">
            <span>{{ formatDate(post.publishedAt) }} · 6 min read</span>
            <span>·</span>
            <button class="text-green-600 hover:text-green-700">Follow</button>
          </div>
        </div>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ post.title }}</h1>
      <p class="text-xl text-gray-600 mb-6">{{ post.description }}</p>
    </header>

    <article class="max-w-screen-md mx-auto px-4 sm:px-6 py-8">
      <img :src="post.banner" alt="Featured Image" class="w-full h-[400px] object-cover rounded-lg mb-8" />
      <div class="prose prose-lg max-w-none" v-html="post.content"></div>
    </article>

    <div class="max-w-screen-md mx-auto px-4 sm:px-6 py-8 border-t border-gray-200">
      <h3 class="font-medium mb-2">Written by {{ post.author.name }}</h3>
      <p class="text-gray-600 mb-4">{{ post.author.bio }}</p>
      <button class="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400">Follow</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const post = ref({});
    const route = useRoute();

    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${route.params.postId}`);
        post.value = response.data.data;
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    onMounted(fetchPost);

    return { post, formatDate };
  }
};
</script>

