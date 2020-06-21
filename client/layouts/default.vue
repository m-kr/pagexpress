<template>
  <div class="app">
    <Navbar />
    <section class="section">
      <div class="container">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar';

export default {
  components: {
    Navbar,
  },
};
</script>
