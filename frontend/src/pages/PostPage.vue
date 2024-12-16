<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const post = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/posts/${route.params.id}`);
    post.value = response.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load post';
  } finally {
    loading.value = false;
  }
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
  </div>
</template>

<style>
.prose img {
  @apply max-w-full h-auto;
}
</style> 