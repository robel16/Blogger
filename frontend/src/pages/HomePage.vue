<template>
  <div class="bg-gray-50 min-h-screen flex flex-col">
    <!-- Header -->
   <header class="py-6 px-6 lg:px-8">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
    <h1 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Blogger</h1>
    <nav class="flex flex-wrap justify-center gap-4 sm:gap-8 items-center">
      <router-link to="/ourstory" class="text-gray-600 hover:text-gray-900">
        Our Story
      </router-link>
      <router-link to="/signup" class="text-gray-600 hover:text-gray-900">Write</router-link>
    </nav>
  </div>
</header>


    <!-- Main Content -->
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-24">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Column -->
          <div class="text-center lg:text-left">
            <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Human stories and
              <span
                id="animated-word"
                :class="animatedWordColor"
                class="animate-word"
              >
                {{ animatedWord }}
              </span>
            </h2>
            <p class="text-lg text-gray-600 mb-8">
              A place to read, write, and deepen your understanding.
            </p>
            <router-link to="/signup" class="inline-block bg-black text-white rounded-full px-6 py-2 hover:bg-gray-800 transition-colors">Sign up</router-link>
          </div>

          <!-- Right Column -->
          <div class="hidden lg:block">
            <img
              src="../assets/images/undraw_typewriter_re_u9i2 (1).svg"
              alt="People reading and writing stories"
              class="w-full h-auto max-w-lg mx-auto"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 px-6 lg:px-8 mt-auto">
      <div class="max-w-7xl mx-auto">
        <nav class="flex flex-wrap justify-center gap-6">
          <a href="../src/pages/help.html" class="text-gray-600 hover:text-gray-900">Help</a>
          <a href="../src/pa" class="text-gray-600 hover:text-gray-900">About</a>
          <a href="../src/pages/presspage.html" class="text-gray-600 hover:text-gray-900">Press</a>
           <router-link to="/ourstory" class="text-gray-600 hover:text-gray-900">
        Our Story
      </router-link>
      <router-link to="/signup" class="text-gray-600 hover:text-gray-900">Write</router-link>
       <router-link to="/blogs">blog</router-link>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      words: ["ideas", "knowledge", "learning"],
      colors: ["text-blue-600", "text-green-600", "text-purple-700"],
      currentIndex: 0,
      animatedWord: "ideas", 
      animatedWordColor: "text-blue-600", 
    };
  },
  mounted() {
    this.changeWord();
    setInterval(this.changeWord, 5000); 
  },
  methods: {
    changeWord() {
      this.animatedWordColor = this.colors[this.currentIndex];
      this.animatedWord = this.words[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.words.length;
    },
  },
};
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped>
@keyframes changeWord {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.animate-word {
  animation: changeWord 2s ease-in-out infinite;
}
</style>
