<template>
  <div>
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
        <img :src="article.author.image" alt="Author" class="w-16 h-16 rounded-full" />
        <div>
          <h2 class="font-medium">{{ article.author.name }}</h2>
          <div class="flex items-center text-sm text-gray-500 space-x-2">
            <span>{{ article.publishedAt }} · {{ article.readTime }} min read</span>
            <span>·</span>
            <button class="text-green-600 hover:text-green-700">Follow</button>
          </div>
        </div>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ article.title }}</h1>
      <p class="text-xl text-gray-600 mb-6">{{ article.description }}</p>
    </header>

    <article class="max-w-screen-md mx-auto px-4 sm:px-6 py-8">
      <img :src="article.image" alt="Featured Image" class="w-full h-[400px] object-cover rounded-lg mb-8" />
      <div class="prose prose-lg max-w-none" v-html="article.content"></div>
    </article>

    <div class="max-w-screen-md mx-auto px-4 sm:px-6 py-8 border-t border-gray-200">
      <h3 class="text-lg font-medium mb-6">Comments</h3>
      <div v-for="comment in comments" :key="comment.id" class="mb-4">
        <p class="font-medium">{{ comment.author }}</p>
        <p class="text-gray-600">{{ comment.text }}</p>
      </div>
      <form @submit.prevent="submitComment">
        <textarea v-model="newComment" placeholder="Leave a comment..." class="w-full border border-gray-300 rounded-lg p-2 mb-4"></textarea>
        <button type="submit" class="bg-black text-white py-2 px-4 rounded">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const article = ref({});
const comments = ref([]);
const newComment = ref('');

const fetchArticle = async () => {
  const response = await axios.get(`http://localhost:5000/api/articles/${route.params.id}`);
  article.value = response.data;
};

const fetchComments = async () => {
  const response = await axios.get(`http://localhost:5000/api/articles/${route.params.id}/comments`);
  comments.value = response.data;
};

const submitComment = async () => {
  if (!newComment.value) return;

  await axios.post(`http://localhost:5000/api/articles/${route.params.id}/comments`, {
    text: newComment.value,
  });

  newComment.value = '';
  fetchComments(); // Refresh comments after submission
};

onMounted(() => {
  fetchArticle();
  fetchComments();
});
</script>