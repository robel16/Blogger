<!-- frontend/src/pages/PublishBlog.vue -->
<template>
  <div class="min-h-screen bg-white p-4">
    <div class="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 relative">
      <button class="absolute right-4 top-4 text-gray-500 hover:text-gray-700" @click="close">
        <i class="fi fi-rr-cross w-6 h-6"></i>
      </button>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Preview Section -->
        <div class="space-y-4">
          <h2 class="text-lg font-medium text-gray-500">Preview</h2>
          <div class="rounded-lg overflow-hidden">
            <img
              :src="formData.bannerImage || '/placeholder.svg?height=300&width=600'"
              alt="Blog preview"
              class="w-full h-[300px] object-cover bg-gray-100"
            />
          </div>
          <h1 class="text-2xl font-bold">{{ formData.title }}</h1>
        </div>

        <!-- Form Section -->
        <div class="space-y-6">
          <div class="space-y-4">
            <label class="block text-sm text-gray-500">Blog Title</label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div class="space-y-4">
            <label class="block text-sm text-gray-500">Short Description about your post</label>
            <textarea
              v-model="formData.description"
              class="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[100px]"
            ></textarea>
            <div class="text-right text-sm text-gray-500">
              {{ 200 - formData.description.length }} characters left
            </div>
          </div>

          <div class="space-y-4">
            <label class="block text-sm text-gray-500">
              Topics - ( Helps in searching and ranking your post )
            </label>
            <input
              v-model="formData.topics"
              type="text"
              class="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <div class="text-right text-sm text-gray-500">
              {{ 10 - formData.topics.split(',').length }} Tags left
            </div>
          </div>

          <button
            @click="publishBlog"
            class="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        title: 'test blog 1',
        description: '',
        topics: '',
        bannerImage: '' // Add a field for the banner image
      }
    }
  },
  methods: {
    publishBlog() {
      // Handle blog publishing logic here
      console.log('Publishing blog:', this.formData);
      // You can add your API call to publish the blog here
    },
    close() {
      // Logic to close the publish page or navigate away
      this.$router.push('/'); // Example: navigate back to home
    }
  }
}
</script>

<style scoped>
@import '@flaticon/flaticon-uicons/css/all/all';
</style>