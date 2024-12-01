<!-- <script>
import Input from './Input.vue'

export default {
  name: 'UserAuthForm',
  components: {
    Input
  },
  data() {
    return {
      formData: {
        fullName: '',
        email: '',
        password: ''
      },
      showPassword: false
    }
  },
  methods: {
    handleSubmit() {
      // Handle form submission
      console.log('Form submitted:', this.formData)
    },
    signInWithGoogle() {
      // Handle Google sign-in
      console.log('Google sign-in clicked')
    }
  }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-semibold text-gray-900">Join Us Today</h1>
      </div>
      
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <Input
          v-model="formData.fullName"
          type="text"
          placeholder="Full Name"
          icon="user"
        />

        <Input
          v-model="formData.email"
          type="email"
          placeholder="Email"
          icon="email"
        />

        <Input
          v-model="formData.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          icon="password"
          :showPassword="showPassword"
          @toggle-password="showPassword = !showPassword"
        />

        <button
          type="submit"
          class="w-full flex justify-center py-3 px-4 rounded-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
        >
          Sign Up
        </button>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button
          type="button"
          @click="signInWithGoogle"
          class="w-full flex items-center justify-center px-4 py-3 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
        >
          <img
            class="h-5 w-5 mr-2"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
          />
          <span class="text-white">Continue with Google</span>
        </button>
      </form>
    </div>
  </div>
</template>
 -->
