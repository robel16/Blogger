<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const formData = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  try {
    await auth.login(formData.value);
    router.push('/');
  } catch (error) {
    console.error('Login error:', error);
    alert(error.response?.data?.message || 'Login failed');
  }
};
</script>

<template>
  <form @submit.prevent="handleLogin">
    <!-- Your login form fields -->
  </form>
</template> 