<template>
  <div class="navbar__outer">
    <div class="container">
      <div class="navbar__brand">
        <nuxt-link class="brand" to="/">PAGE<small>xpress</small></nuxt-link>
      </div>
      <div class="navbar__action">
        <button v-if="isAuthenticated" class="button is-light" @click="logout">
          <strong>Logout</strong>
        </button>
        <nuxt-link v-else class="button is-primary" to="/sign-in"
          ><strong>Sign In</strong></nuxt-link
        >
      </div>
    </div>
  </div>
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

<style>
.navbar__outer {
  padding: 0.5rem 1.5rem;

  .container {
    display: grid;
    grid-template-columns: 1fr auto;
  }
}

.navbar__brand {
  font-size: 2.4rem;

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
