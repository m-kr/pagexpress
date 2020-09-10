import { v4 as uuidv4 } from 'uuid';

const initialState = {
  notifications: [
    {
      id: '1233',
      type: 'success',
      message: 'asdfasdfa sdfas dfasdf',
    },
  ],
};

const mutations = {
  NOTIFY(state, notificationData) {
    state.notifications = [
      ...state.notifications,
      {
        ...notificationData,
        id: uuidv4(),
      },
    ];
  },

  EXPIRE_NOTIFICATION(state, notificationId) {
    state.notifications = state.notifications.filter(
      notification => notification.id !== notificationId
    );
  },

  CLEAR_NOTIFICATIONS(state) {
    state.notifications = [];
  },
};

const actions = {
  notify({ commit }, message) {
    commit('NOTIFY', { message });
  },

  success({ commit }, message) {
    commit('NOTIFY', {
      type: 'success',
      message,
    });
  },

  info({ commit }, message) {
    commit('NOTIFY', {
      type: 'info',
      message,
    });
  },

  error({ commit }, message) {
    commit('NOTIFY', {
      type: 'error',
      message,
    });
  },

  expire({ commit }, notificationId) {
    commit('EXPIRE_NOTIFICATION', notificationId);
  },

  clear({ commit }) {
    commit('CLEAR_NOTIFICATIONS');
  },
};

export default {
  state: initialState,
  mutations,
  actions,
};
