<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">Pagexpress</nuxt-link>
      </div>
      <div class="navbar-menu is-active">
        <div class="navbar-end">
          <div v-if="isAuthenticated" class="navbar-item">
            <a class="button is-light" @click.prevent="logout">Logout</a>
          </div>
          <div v-else class="navbar-item">
            <nuxt-link class="button is-primary navbar-item" to="/sign-in"
              ><strong>Sign In</strong></nuxt-link
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },

  methods: {
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>
