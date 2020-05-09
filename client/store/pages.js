export const state = () => ({
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
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
      query: {
        page: nextPage || state.currentPage,
      },
    });
    return commit('LOAD_PAGES', data);
  },

  async removePage({ commit, state }, pageId) {
    const { data } = await this.$axios.delete(`pages/${pageId}`);

    if (data) {
      return commit('REMOVE_PAGE', pageId);
    }
  },
};
