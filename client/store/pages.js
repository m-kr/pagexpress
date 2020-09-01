export const state = () => ({
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 1,
  pagesList: [],
});

export const mutations = {
  LOAD_PAGES(state, { data, currentPage, totalPages }) {
    state.pagesList = data;
    state.currentPage = currentPage;
    state.totalPages = totalPages;
  },

  REMOVE_PAGE(state, pageId) {
    state.pagesList = state.pagesList.filter(page => page._id !== pageId);
  },
};

export const actions = {
  async loadPages({ commit, state }, { nextPage } = {}) {
    const { data } = await this.$axios.get('pages', {
      params: {
        page: nextPage || state.currentPage,
        limit: state.itemsPerPage,
      },
    });
    return commit('LOAD_PAGES', data);
  },

  async removePage({ commit }, pageId) {
    const { data } = await this.$axios.delete(`pages/${pageId}`);

    if (data) {
      return commit('REMOVE_PAGE', pageId);
    }
  },

  async changePage({ state, dispatch }, targetPage) {
    if (
      targetPage === state.currentPage ||
      targetPage < 1 ||
      targetPage > state.totalPages
    ) {
      return console.error('Wrong page number');
    }

    await dispatch('loadPages', targetPage);
  },
};
