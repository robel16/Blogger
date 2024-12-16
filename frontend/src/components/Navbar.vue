<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { useRouter } from "vue-router";

const props = defineProps(['isAuthenticated']);
const emit = defineEmits(['logout']); // Define emit for logout
const router = useRouter();
const showSearch = ref(false);
const showUserMenu = ref(false);
const userImage = ref("");
const userName = ref("");

// Fetch user data on mount (if needed)
onMounted(() => {
  if (props.isAuthenticated) {
    userImage.value = localStorage.getItem("userImage") || "/default-avatar.png"; // Replace with actual user image URL
    userName.value = localStorage.getItem("userName") || "User"; // Replace with actual user name
  }
});

const handleLogout = () => {
  localStorage.removeItem("token"); // Remove the token from localStorage
  localStorage.removeItem("userName"); // Remove user name from localStorage
  localStorage.removeItem("userImage"); // Remove user image from localStorage
  emit('logout'); // Emit logout event
  router.push("/signup"); // Redirect to signup page
};

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
          <router-link to="/" class="text-2xl font-bold text-gray-800">
            Blogger
          </router-link>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <template v-if="props.isAuthenticated">
            <!-- Show these when user is logged in -->
            <router-link
              to="/create-post"
              class="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <i class="fi fi-rr-plus text-lg"></i>
              <span class="hidden sm:inline">Create Post</span>
            </router-link>

            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2"
              >
                <img
                  :src="userImage"
                  :alt="userName"
                  class="w-8 h-8 rounded-full object-cover border border-gray-200"
                  @error="userImage = '/default-avatar.png'"
                />
              </button>

              <!-- Dropdown menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  Signed in as <br />
                  <strong>{{ userName }}</strong>
                </div>
                <router-link
                  to="/dashboard"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </router-link>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <!-- Show this when user is not logged in -->
            <router-link
              to="/signup"
              class="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Get started
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>