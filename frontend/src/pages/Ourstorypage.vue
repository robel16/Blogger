<script setup></script>
<template>

  <body class="bg-black text-white min-h-screen flex flex-col">
    <!-- <header class="bg-black shadow-sm">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center"
      >
        <a href="/" class="text-2xl font-bold text-white">Blogger</a>
        <nav class="space-x-4">
          <a href="/" class="text-gray-300 hover:text-white">Home</a>
          <a href="/our-story" class="text-white font-semibold">Our Story</a>
          <a href="/about" class="text-gray-300 hover:text-white">About</a>
          <a href="/press" class="text-gray-300 hover:text-white">Press</a>
        </nav>
      </div>
    </header> -->

    <main class="flex-grow">
      <section
        class="parallax h-screen flex items-center justify-center"
        style="
          background-image: url('https://aicontentfy.com/hubfs/Blog/9766704c-14cb-48a5-b312-19f181be15fd.jpg');
        "
      >
        <div class="text-center">
          <h1 class="text-6xl text-black font-bold mb-4">
            Everyone has a story to tell
          </h1>
          <p class="text-xl text-black">
            Discover the power of words on Blogger
          </p>
        </div>
      </section>

      <section class="py-20 px-4">
        <div class="max-w-3xl mx-auto">
          <p class="text-xl leading-relaxed mb-8 text-white">
            Blogger is a home for human stories and ideas. Here, anyone can
            share knowledge and wisdom with the world—without having to build a
            mailing list or a following first. The internet is noisy and
            chaotic; Blogger is quiet yet full of insight. It's simple,
            beautiful, collaborative, and helps you find the right readers for
            whatever you have to say.
          </p>
          <p class="text-xl leading-relaxed mb-8 text-blacktext-black">
            Ultimately, our goal is to deepen our collective understanding of
            the world through the power of writing.
          </p>
          <p class="text-xl leading-relaxed mb-8 text-white">
            We believe that what you read and write matters. Words can divide or
            empower us, inspire or discourage us. In a world where the most
            sensational and surface-level stories often win, we're building a
            system that rewards depth, nuance, and time well spent. A space for
            thoughtful conversation more than drive-by takes, and substance over
            packaging.
          </p>
        </div>
      </section>

      <section
        class="parallax h-screen flex items-center justify-center"
        style="
          background-image: url('https://mir-s3-cdn-cf.behance.net/projects/404/0b2e08194676751.Y3JvcCwxMDA2LDc4NywxOTYsMA.jpg');
        "
      >
        <div class="text-center">
          <h2 class="text-4xl font-bold mb-4 text-black">
            Join our community of writers and readers
          </h2>
          <a
            href="/sign-up"
            class="inline-block bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >Get Started</a
          >
        </div>
      </section>

      <section class="py-20 px-4">
        <div class="max-w-3xl mx-auto">
          <p class="text-xl leading-relaxed mb-8">
            Over 100 million people connect and share their wisdom on Blogger
            every month. They're software developers, amateur novelists, product
            managers, data scientists, politicians, stay-at-home parents, CEOs,
            and everyone in between. They come here to learn, to think, and to
            stay informed.
          </p>
          <p class="text-xl leading-relaxed">
            We're building a place where ideas develop, take shape, and spread.
            Where what you read matters and can change how you think or see the
            world. We'd love for you to be a part of it.
          </p>
        </div>
      </section>
    </main>

    <footer class="bg-gray-900">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-400"
      >
        &copy; 2023 Blogger. All rights reserved.
      </div>
    </footer>
  </body>


</template>

<style>
  .parallax {
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }
</style>