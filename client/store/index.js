import { showRequestResult } from '@/utils';

export const state = () => ({
  breadcrumbsLinks: [],
  siteInfo: null,
  isDirty: false,
});

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },

  loggedInUser(state) {
    return state.auth.user;
  },
};

export const mutations = {
  UPDATE_BREADCRUMBS_LINKS(state, links) {
    state.breadcrumbsLinks = links;
  },

  SET_SITE_INFO(state, siteInfo) {
    state.siteInfo = siteInfo;
  },

  UNSAVED_CHANGES(state) {
    if (!state.isDirty) {
      state.isDirty = true;
    }
  },

  RESET_DIRTY_STATE(state) {
    state.isDirty = false;
  },
};

export const actions = {
  async fetchSiteInfo({ dispatch, commit }) {
    const siteInfo = await showRequestResult({
      request: this.$axios.get('site-info'),
      dispatch,
    });

    if (siteInfo) {
      commit('SET_SITE_INFO', siteInfo);
    }
  },

  setDirtyState({ commit }) {
    commit('UNSAVED_CHANGES');
  },

  resetDirtyState({ commit }) {
    commit('RESET_DIRTY_STATE');
  },
};
