<script setup>
import { ref, onMounted } from "vue";
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const showSearch = ref(false);
const user = ref(null);
const showUserMenu = ref(false);
const userImage = ref('');
const userName = ref('');

onMounted(() => {
  auth.onAuthStateChanged((currentUser) => {
    user.value = currentUser;
    if (currentUser) {
      userImage.value = currentUser.photoURL || 
        localStorage.getItem('userImage') || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName)}`;
      userName.value = currentUser.displayName || localStorage.getItem('userName');
    }
  });
});

const handleLogout = async () => {
  try {
    await signOut(auth);
    localStorage.clear();
    router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
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
          <h1 class="text-2xl font-bold text-gray-800">Blogger</h1>
        </div>

        <!-- Search bar -->
        <div class="hidden md:block flex-1 max-w-md mx-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fi fi-rr-search text-gray-400"></i>
            </div>
            <input
              type="search"
              class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Search"
            />
          </div>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <button
            @click="toggleSearch"
            class="block md:hidden text-gray-700 hover:text-gray-900"
          >
            <i class="fi fi-rr-search text-lg"></i>
          </button>

          <!-- Show these when user is logged in -->
          <template v-if="user">
            <button class="text-gray-700 hover:text-gray-900">
              <i class="fi fi-rr-bell text-lg"></i>
            </button>
            
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
                  Signed in as <br>
                  <strong>{{ userName }}</strong>
                </div>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </a>
                <button 
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </template>

          <!-- Show this when user is not logged in -->
          <router-link
            v-else
            to="/signup"
            class="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Get started
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mobile search -->
    <div
      v-if="showSearch"
      class="md:hidden px-4 py-2 bg-gray-100 border-t border-gray-200"
    >
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
