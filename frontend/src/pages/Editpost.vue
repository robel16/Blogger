<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import TagInput from '../components/TagInput.vue';

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const error = ref(null);

// Form data
const title = ref('');
const description = ref('');
const tags = ref([]);
const banner = ref('');
const content = ref({
  blocks: [],
  time: 0,
  version: ''
});
const contentText = ref(''); // Separate ref for the text content

// Get blogId from route params
const blogId = route.params.blogId;
console.log('Editing post with ID:', blogId); // Debug log

const fetchPost = async () => {
  if (!blogId) {
    error.value = 'No post ID provided';
    isLoading.value = false;
    return;
  }

  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`http://localhost:5000/api/posts/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const post = response.data.data.post;
    console.log('Fetched post:', post);
    
    title.value = post.title;
    description.value = post.description;
    tags.value = post.tags || [];
    banner.value = post.banner;

    // Extract text from content blocks
    if (post.content && post.content.blocks && post.content.blocks.length > 0) {
      contentText.value = post.content.blocks[0].data.text;
      content.value = post.content;
    } else {
      contentText.value = '';
      content.value = {
        blocks: [{
          type: 'paragraph',
          data: {
            text: ''
          }
        }],
        time: Date.now(),
        version: '2.30.7'
      };
    }
    
    isLoading.value = false;
  } catch (err) {
    console.error('Error fetching post:', err);
    error.value = 'Failed to load post';
    isLoading.value = false;
  }
};

// Submit updated post
const submitEdit = async () => {
  if (!blogId) {
    error.value = 'No post ID provided';
    return;
  }

  const token = localStorage.getItem('token');
  try {
    // Update content structure before submitting
    content.value = {
      blocks: [{
        type: 'paragraph',
        data: {
          text: contentText.value
        }
      }],
      time: Date.now(),
      version: '2.30.7'
    };

    const updatedPost = {
      title: title.value,
      description: description.value,
      tags: tags.value,
      banner: banner.value,
      content: content.value
    };

    await axios.put(`http://localhost:5000/api/posts/${blogId}`, updatedPost, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    router.push('/dashboard');
  } catch (err) {
    console.error('Error updating post:', err);
    error.value = 'Failed to update post';
  }
};

onMounted(() => {
  fetchPost();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <div class="max-w-4xl mx-auto p-8">
      <h1 class="text-2xl font-bold mb-2">Edit Post</h1>
      <p class="text-gray-600 mb-8">Update your post content and settings</p>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <div v-if="isLoading" class="text-center py-8">
        Loading...
      </div>

      <form v-else @submit.prevent="submitEdit" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            v-model="title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <TagInput
            v-model="tags"
            placeholder="Add tags..."
            :maxTags="5"
          />
        </div>

        <!-- Banner Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>
          <div class="flex items-center space-x-4">
            <img
              v-if="banner"
              :src="banner"
              alt="Banner preview"
              class="h-32 w-48 object-cover rounded"
            />
            <input
              type="file"
              accept="image/*"
              @change="handleBannerUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <!-- Content Editor -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            v-model="contentText"
            rows="10"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="router.push('/dashboard')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>