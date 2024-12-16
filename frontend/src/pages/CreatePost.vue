<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PostEditor from "../components/PostEditor.vue";
import TagInput from "../components/TagInput.vue";
import axios from "axios";

const router = useRouter();
const editor = ref(null);
const title = ref("");
const bannerImage = ref(null);
const bannerPreview = ref("");
const description = ref("");
const tags = ref([]);
const tagInput = ref("");
const isSubmitting = ref(false);
const error = ref("");
const isDraft = ref(true);
const editorContent = ref(null);

onMounted(async () => {
  const token = localStorage.getItem("token");
  console.log("Token on mount:", token); // Debug log

  if (!token) {
    error.value = "Please log in to create posts";
    router.push("/signup");
    return;
  }

  // Verify token is valid
  try {
    const response = await axios.get("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User verified:", response.data);
  } catch (err) {
    console.error("Token verification failed:", err);
    // Clear invalid token
    error.value = "Session expired. Please log in again.";
    router.push("/signup");
  }
});

const handleBannerUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        bannerPreview.value = e.target.result;
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      bannerImage.value = response.data.url;
    } catch (error) {
      console.error("Banner upload failed:", error);
      error.value = "Failed to upload banner image";
    }
  }
};

const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag);
  }
  tagInput.value = "";
};

const removeTag = (index) => {
  tags.value.splice(index, 1);
};

const handleEditorUpdate = (content) => {
  editorContent.value = content;
};

const saveDraft = async () => {
  await submitPost(true);
};

const publish = async () => {
  await submitPost(false);
};

const submitPost = async (isDraft) => {
  if (!title.value) {
    error.value = "Title is required";
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    error.value = "Please log in to create posts";
    router.push("/signup");
    return;
  }

  isSubmitting.value = true;
  error.value = "";

  try {
    const content = await editor.value.getContent();
    console.log("Using token:", token); // Debug log

    const postData = {
      blog_id: Date.now().toString(),
      title: title.value,
      content,
      banner: bannerImage.value,
      description: description.value,
      tags: tags.value,
      draft: isDraft,
    };

    console.log("Sending post data:", postData); // Debug log

    const response = await axios.post(
      "http://localhost:5000/api/posts",
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
console.log("Full response:", response);
    console.log("Response:", response.data); // Debug log

    if(response.data.status === 'Success' && response.data.post) {
      router.push(`/posts/${response.data.post.blog_id}`);
    } else {
      throw new Error(response.data.message || "Failed to create post");
    }
  } catch (err) {
    console.error("Error creating post:", err);
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      error.value = "Session expired. Please log in again.";
      router.push("/login");
    } else {
      error.value = err.response?.data?.message || "Failed to create post";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="bg-white min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white fixed w-full top-0 z-50 border-b border-gray-100">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Left: Logo and Title -->
          <div class="flex items-center">
            <router-link
              to="/"
              class="flex items-center text-2xl font-bold text-gray-800"
            >
              Blogger
            </router-link>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center space-x-4">
            <button
              @click="saveDraft"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Save Draft
            </button>
            <button
              @click="publish"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm bg-black text-white rounded-full hover:bg-gray-800"
            >
              {{ isSubmitting ? "Publishing..." : "Publish" }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-16 pb-16">
      <div class="max-w-screen-lg mx-auto px-4">
        <!-- Error message -->
        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {{ error }}
        </div>

        <!-- Banner Upload -->
        <div class="mt-8 mb-6">
          <div
            class="relative w-full aspect-[3/1] bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            :style="
              bannerPreview
                ? `background-image: url(${bannerPreview}); background-size: cover; background-position: center;`
                : ''
            "
          >
            <input
              type="file"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              @change="handleBannerUpload"
            />
            <p v-if="!bannerPreview" class="text-2xl text-gray-300 select-none">
              Blog Banner
            </p>
          </div>
        </div>

        <!-- Title Input -->
        <div class="mb-8">
          <input
            v-model="title"
            type="text"
            placeholder="Blog Title"
            class="w-full text-4xl text-gray-800 border-none outline-none placeholder-gray-300 focus:ring-0"
          />
        </div>

        <!-- Editor -->
        <PostEditor
          ref="editor"
          class="prose prose-lg max-w-none"
          @update:content="handleEditorUpdate"
        />

        <!-- Add description and tags fields to your existing template -->
        <div class="mb-6">
          <label class="block text-sm text-gray-500 mb-2">Description</label>
          <textarea
            v-model="description"
            class="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[100px]"
            placeholder="Brief description of your post..."
            maxlength="200"
          ></textarea>
          <div class="text-right text-sm text-gray-500">
            {{ 200 - description.length }} characters left
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm text-gray-500 mb-2">Tags</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(tag, index) in tags"
              :key="index"
              class="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center"
            >
              {{ tag }}
              <button @click="removeTag(index)" class="ml-2">
                <i class="fi fi-rr-cross text-xs"></i>
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="tagInput"
              @keydown.enter.prevent="addTag"
              type="text"
              placeholder="Add tags..."
              class="flex-1 p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <button
              @click="addTag"
              class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Add Tag
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.prose img {
  @apply max-w-full h-auto rounded-lg;
}

.prose h2,
.prose h3 {
  @apply text-gray-900;
}
</style>
