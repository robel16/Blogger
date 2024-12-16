<script setup>
const topics = [
  { id: 1, name: 'Programming', active: false },
  { id: 2, name: 'Hollywood', active: false },
  { id: 3, name: 'Film Making', active: false },
  { id: 4, name: 'Social Media', active: false },
  { id: 5, name: 'Food', active: true },
  { id: 6, name: 'Technology', active: false },
  { id: 7, name: 'Finances', active: false },
  { id: 8, name: 'Travel', active: true }
];
</script>

<template>
  <div>
    <h3 class="text-base font-medium mb-4">
      Stories from all interests
    </h3>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="topic in topics"
        :key="topic.id"
        :class="[
          'px-4 py-2 rounded-full text-sm transition-colors',
          topic.active 
            ? 'bg-black text-white hover:bg-gray-200 hover:text-black' 
            : 'bg-gray-100 hover:bg-gray-200'
        ]"
      >
        {{ topic.name }}
      </button>
    </div>
  </div>
</template> 