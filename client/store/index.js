export const state = {
  breadcrumbsLinks: [],
};

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
};
