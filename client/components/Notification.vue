<template>
  <div
    :class="notificationTypeClass"
    class="notification"
    @mouseenter="holdDestroyTimeout"
    @mouseleave="setSelfDestroyTimeout"
  >
    <button class="delete" @click="destroy"></button>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Notification',

  props: {
    destroy: {
      type: Function,
      required: true,
    },
    destroyTimeout: {
      type: Number,
      default: 2000,
    },
    notificationTypeClass: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      selfDestroyTimeout: null,
    };
  },

  mounted() {
    this.setSelfDestroyTimeout();
  },

  methods: {
    holdDestroyTimeout() {
      clearTimeout(this.selfDestroyTimeout);
    },

    setSelfDestroyTimeout() {
      this.selfDestroyTimeout = setTimeout(this.destroy, this.destroyTimeout);
    },
  },
};
</script>

<style lang="postcss" scoped>
.notification {
  font-size: var(--font-md);
  font-weight: var(--font-weight-medium);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  &:not(:last-of-type) {
    margin-bottom: var(--spacing);
  }
}
</style>
