import { v4 as uuidv4 } from 'uuid';

const initialState = {
  notifications: [
    {
      id: '123',
      type: 'error',
      message: 'Unexpected error',
    },
    {
      id: '124',
      type: 'success',
      message: 'Saved page',
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
  notify({ commit }, notificationData) {
    commit('NOTIFY', notificationData);
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
