<template>
  <div class="app">
    <NotificationToasts />
    <Navbar />
    <Breadcrumbs />
    <div class="container">
      <nuxt />
    </div>
  </div>
</template>

<script>
import { Navbar, NotificationToasts, Breadcrumbs } from '@/components';

export default {
  components: {
    Breadcrumbs,
    Navbar,
    NotificationToasts,
  },
};
</script>

<style lang="postcss" scoped>
.container {
  padding-bottom: var(--spacing-2);
}
</style>
