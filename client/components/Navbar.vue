<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar__brand">
        <nuxt-link class="brand" to="/">PAGE<small>xpress</small></nuxt-link>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <nuxt-link to="/" class="navbar-item">
            Pages
          </nuxt-link>
          <nuxt-link to="/menus" class="navbar-item">
            Menu
          </nuxt-link>
        </div>
      </div>
      <div class="navbar-end navbar__action">
        <button v-if="isAuthenticated" class="button is-light" @click="logout">
          <strong>Logout</strong>
        </button>
        <nuxt-link v-else class="button is-primary" to="/sign-in"
          ><strong>Sign In</strong></nuxt-link
        >
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated']),
  },

  methods: {
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>

<style lang="postcss">
.navbar {
  margin-bottom: var(--spacing-15);
}

.navbar__brand {
  font-size: 2.4rem;
  margin-right: var(--spacing);

  a {
    color: var(--body-color);
  }

  small {
    font-size: 0.7em;
    line-height: 0.3em;
  }
}

.navbar__action {
  display: flex;
  align-items: center;
}
</style>
