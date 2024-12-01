<script setup>
import { ref } from "vue";
import { auth } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile 
} from 'firebase/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref("");
const password = ref("");
const registerEmail = ref("");
const registerPassword = ref("");
const registerUsername = ref("");
const isLogin = ref(true);
const error = ref("");
const isLoading = ref(false);

const toggleForm = () => {
  isLogin.value = !isLogin.value;
  error.value = "";
};

const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;
    localStorage.setItem("token", await user.getIdToken());
    router.push('/');
  } catch (err) {
    console.error("Login error:", err);
    error.value = err.message;
  }
};

// Save user to database
const saveUserToDatabase = async (userData) => {
  try {
    console.log("Attempting to save user data:", userData);
    const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000
    });
    console.log("Database save successful:", response.data);
    return response.data;
  } catch (err) {
    console.error("Database Error Details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers
    });
    if (err.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    throw new Error(err.response?.data?.message || "Failed to save user data");
  }
};

const handleRegister = async () => {
  isLoading.value = true;
  error.value = "";
  
  try {
    if (!registerEmail.value || !registerPassword.value || !registerUsername.value) {
      throw new Error('Please fill in all fields');
    }

    // Create Firebase user first
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      registerEmail.value,
      registerPassword.value
    );

    // Default profile picture URL
    const defaultProfilePic = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(registerUsername.value);

    try {
      // Save to database first
      await saveUserToDatabase({
        username: registerUsername.value,
        email: registerEmail.value,
        password: registerPassword.value,
        profilePicture: defaultProfilePic,
        isGoogleUser: false
      });

      // If database save is successful, update Firebase profile
      await updateProfile(userCredential.user, {
        displayName: registerUsername.value,
        photoURL: defaultProfilePic
      });

      // Store user info
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("userName", registerUsername.value);
      localStorage.setItem("userImage", defaultProfilePic);

      alert("Registration successful!");
      router.push('/');
    } catch (dbError) {
      // If database save fails, delete the Firebase user
      await userCredential.user.delete();
      throw dbError;
    }
  } catch (err) {
    console.error("Registration error:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  isLoading.value = true;
  error.value = "";
  
  try {
    const provider = new GoogleAuthProvider();
    // Add additional scopes and settings
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    // Use try-catch specifically for the popup
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Sign-in Response:", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        emailVerified: user.emailVerified,
        metadata: user.metadata
      });

      // Get the ID token
      const token = await user.getIdToken();
      console.log("Google User Token:", token);

      // Save Google user to database
      const userData = {
        username: user.displayName || `user_${user.uid.slice(0, 5)}`, // Fallback username
        email: user.email,
        profilePicture: user.photoURL,
        isGoogleUser: true
      };
      console.log("Sending to Database:", userData);

      try {
        const dbResponse = await saveUserToDatabase(userData);
        console.log("Database Response:", dbResponse);

        // Store user info in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userImage", user.photoURL);
        localStorage.setItem("userName", user.displayName);
        
        router.push('/');
      } catch (dbError) {
        console.error("Database save failed:", dbError);
        // Handle database error but don't sign out the user
        error.value = "Account created but profile save failed. Please try again.";
      }
    } catch (popupError) {
      console.error("Popup error:", popupError);
      if (popupError.code === 'auth/popup-closed-by-user') {
        error.value = "Sign-in cancelled. Please try again.";
      } else if (popupError.code === 'auth/popup-blocked') {
        error.value = "Popup was blocked. Please allow popups and try again.";
      } else {
        error.value = "Google sign-in failed. Please try again.";
      }
    }
  } catch (err) {
    console.error("Google sign-in error:", err);
    error.value = "Authentication failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <div id="forms">
        <!-- Login Form -->
        <div id="login-form" v-if="isLogin">
          <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="email">Email</label>
              <input
                v-model="email"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="password">Password</label>
              <input
                v-model="password"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div v-if="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>
            <div class="flex items-center justify-between">
              <button
                class="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
              <a
                @click.prevent="toggleForm"
                class="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-black cursor-pointer"
              >
                Create Account
              </a>
            </div>
          </form>
          
          <!-- Add this after the form -->
          <div class="mt-4">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <button
              @click="handleGoogleSignIn"
              type="button"
              class="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                class="w-5 h-5"
              />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>

        <!-- Register Form -->
        <div id="register-form" v-else>
          <h2 class="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <form @submit.prevent="handleRegister">
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="registerUsername">Username</label>
              <input
                v-model="registerUsername"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="registerUsername"
                type="text"
                placeholder="Username"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="registerEmail">Email</label>
              <input
                v-model="registerEmail"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="registerEmail"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="registerPassword">Password</label>
              <input
                v-model="registerPassword"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="registerPassword"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {{ error }}
            </div>
            <div class="flex items-center justify-between">
              <button
                :disabled="isLoading"
                class="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                type="submit"
              >
                {{ isLoading ? 'Processing...' : 'Sign Up' }}
              </button>
              <a
                @click.prevent="toggleForm"
                class="text-gray-600 hover:underline cursor-pointer"
              >
                Already have an account?
              </a>
            </div>
          </form>
          
          <!-- Add this after the form -->
          <div class="mt-4">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>
            
            <button
              :disabled="isLoading"
              @click="handleGoogleSignIn"
              type="button"
              class="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                class="w-5 h-5"
              />
              <span>{{ isLoading ? 'Processing...' : 'Sign up with Google' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
