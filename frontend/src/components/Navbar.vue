<script setup>
import { ref } from "vue";

const showSearch = ref(false);
const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};
</script>

<template>
  <nav class="border-b border-gray-200 bg-white fixed w-full top-0 z-50">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <h1 class="text-2xl font-bold text-gray-800">Blogger</h1>
        </div>

        <!-- Search bar (visible on medium and larger screens) -->
        <div class="hidden md:block flex-1 max-w-md mx-4">
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <i class="fi fi-rr-search text-gray-400"></i>
            </div>
            <input
              type="search"
              class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Search"
            />
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center space-x-4">
          <!-- Toggle search for small screens -->
          <button
            @click="toggleSearch"
            class="block md:hidden text-gray-700 hover:text-gray-900 bg-gray-400 rounded-md"
          >
            <i class="fi fi-rr-search text-lg"></i>
          </button>
          <router-link
            to="/signup"
            class="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Get started
          </router-link>
        </div>
      </div>
    </div>

    <div
      v-if="showSearch"
      class="md:hidden px-4 py-2 bg-gray-100 border-t border-gray-200"
    >
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="fi fi-rr-search text-gray-400"></i>
        </div>
        <input
          type="search"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          placeholder="Search"
        />
      </div>
    </div>
  </nav>
</template>
