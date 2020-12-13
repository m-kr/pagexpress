<template>
  <div v-if="breadcrumbsLinks.length" class="breadcrumbs__container container">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li
          v-for="(link, index) in breadcrumbsLinks"
          :key="index"
          :class="index === breadcrumbsLinks.length - 1 ? 'is-active' : null"
        >
          <nuxt-link
            :aria-current="
              index === breadcrumbsLinks.length - 1 ? 'page' : false
            "
            :to="link.url"
            >{{ link.label }}</nuxt-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Breadcrumbs',

  computed: {
    ...mapState(['breadcrumbsLinks']),
  },
};
</script>

<style lang="postcss">
.breadcrumbs__container {
  margin-bottom: var(--spacing-15);
}
</style>
