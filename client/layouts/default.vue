<template>
  <div class="app">
    <NotificationToasts />
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
import NotificationToasts from '~/components/NotificationToasts';

export default {
  components: {
    Navbar,
    NotificationToasts,
  },
};
</script>
