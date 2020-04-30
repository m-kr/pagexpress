<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Sign up</h2>

          <Notification v-if="error" :message="error" />

          <form method="post" @submit.prevent="register">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  v-model="username"
                  type="text"
                  class="input"
                  name="username"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  v-model="email"
                  type="email"
                  class="input"
                  name="email"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  v-model="password"
                  type="password"
                  class="input"
                  name="password"
                  required
                />
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">
                Sign up
              </button>
            </div>
          </form>

          <div class="has-text-centered" style="margin-top: 2rem">
            Already got an account? <nuxt-link to="/sign-in">Sign In</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from '~/components/Notification';

export default {
  components: {
    Notification,
  },

  data() {
    return {
      username: '',
      email: '',
      password: '',
      error: null,
    };
  },

  methods: {
    async register() {
      try {
        await this.$axios.post('register', {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        });

        this.$router.push('/');
      } catch (e) {
        this.error = e.response.data.message;
      }
    },
  },
};
</script>
