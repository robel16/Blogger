<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex items-center space-x-4">
            <img 
              :src="userProfile.photoURL || defaultAvatar" 
              :alt="userProfile.displayName"
              class="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ userProfile.displayName }}</h1>
              <p class="text-gray-500">{{ userProfile.email }}</p>
            </div>
          </div>

          <div class="mt-6 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Member since</span>
              <span class="text-gray-900">{{ formatDate(userProfile.createdAt) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Total posts</span>
              <span class="text-gray-900">{{ userProfile.totalPosts }}</span>
            </div>
          </div>

          <div class="mt-6">
            <button 
              @click="editProfile"
              class="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '../firebase/config';
import axios from 'axios';

const userProfile = ref({});
const defaultAvatar = 'https://ui-avatars.com/api/?background=random';

const fetchUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const response = await axios.get('/api/users/profile');
      userProfile.value = {
        ...response.data,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const editProfile = () => {
  // Implement profile editing functionality
  console.log('Edit profile clicked');
};

onMounted(fetchUserProfile);
</script>