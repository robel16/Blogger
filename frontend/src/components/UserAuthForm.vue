<script setup>
import { getCurrentInstance } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const signInWithGoogle = async () => {
  try {
    if (!proxy.$gAuth) {
      throw new Error('Google Auth not initialized');
    }

    const googleUser = await proxy.$gAuth.signIn();
    if (!googleUser) {
      throw new Error('Google sign-in failed');
    }

    const authResponse = googleUser.getAuthResponse();
    const idToken = authResponse.id_token;
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/google-login`,
      { idToken },
      { withCredentials: true }
    );

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userImage", response.data.profilePicture);
    localStorage.setItem("userName", response.data.username);
    
    router.push('/');
  } catch (error) {
    console.error("Google sign-in error:", error);
    alert("Google sign-in failed: " + (error.message || "Unknown error"));
  }
};
</script>

<template>
  <div class="flex justify-center mt-4">
    <button
      @click="signInWithGoogle"
      class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
      <span>Sign in with Google</span>
    </button>
  </div>
</template> 
