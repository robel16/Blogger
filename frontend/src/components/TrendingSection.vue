<script setup>
const trendingArticles = [
];
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-medium">Trending</h3>
      <i class="bx bx-trending-up"></i>
    </div>
    <div class="space-y-4">
      <div 
        v-for="(article, index) in trendingArticles" 
        :key="article.id"
        class="flex gap-4"
      >
        <span class="text-3xl font-bold text-gray-200">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
        <div>
          <div class="flex items-center space-x-2 mb-1">
            <img
              :src="article.author.image"
              :alt="article.author.name"
              class="w-6 h-6 rounded-full"
            />
            <span class="text-sm"> {{ article.author.username }} @ {{ article.date }}
            </span>
          </div>
          <h4 class="font-bold">{{ article.title }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>