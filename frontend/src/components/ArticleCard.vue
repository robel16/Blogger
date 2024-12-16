<!-- src/components/ArticleCard.vue -->
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<<template>
  <article class="flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-4 mb-4">
    <div class="flex-1">
      <div class="flex items-center space-x-2 mb-2">
        <img
          :src="../assets/images/default-avatar.png"
          :alt="article.author?.name"
          class="w-8 h-8 rounded-full"
        />
        <router-link 
          :to="`/profile/${article.author?.id}`" 
          class="text-sm font-medium hover:underline"
        >
          {{ article.author?.name }} 
        </router-link>
        <span class="text-sm text-gray-500">@ {{ formatDate(article.publishedAt) }}</span>
      </div>
      <h2 class="text-xl font-bold mb-2 hover:underline">
        <router-link :to="`/article/${article.blog_id}`">
          {{ article.title }}
        </router-link>
      </h2>
      <p class="text-gray-600 mb-4">
        {{ article.description }}
      </p>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="px-2 py-1 bg-gray-100 rounded-full text-sm">
            {{ article.category }}
          </span>
          <div class="flex items-center space-x-1 text-gray-500">
            <i class="bx bx-heart"></i>
            <span>{{ article.activity?.total_likes || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="md:w-48 h-32">
      <img
        :src="article.banner || require('../assets/images/default-image.jpg')"
        :alt="article.title"
        class="w-full h-full object-cover rounded"
      />
    </div>
  </article>
</template>