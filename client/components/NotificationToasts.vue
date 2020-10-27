<template>
  <div class="notification-toasts">
    <transition-group name="fade">
      <Notification
        v-for="notification in notifications"
        :key="notification.id"
        :notification-type-class="notificationTypeClasses[notification.type]"
        :destroy="() => expire(notification.id)"
        class="notification"
      >
        {{ notification.message }}
      </Notification>
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Notification from '@/components/Notification';

export default {
  name: 'NotificationToasts',

  components: {
    Notification,
  },

  data() {
    return {
      notificationTypeClasses: {
        error: 'is-danger',
        success: 'is-success',
        warning: 'is-warning',
        info: 'is-info',
      },
    };
  },

  computed: {
    ...mapState({
      notifications: state => state.notifications.notifications,
    }),
  },

  methods: {
    ...mapActions({
      expire: 'notifications/expire',
    }),
  },
};
</script>

<style lang="postcss" scoped>
.notification-toasts {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 25rem;
  max-width: 100%;
  right: var(--spacing);
  bottom: var(--spacing);
  z-index: 999;
}
</style>
