import { formatRequestError } from '@/utils';

export const state = () => ({
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  pagesList: [],
  search: null,
  sort: '-updatedAt',
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

  SEARCH_PAGE(state, search) {
    state.search = search;
  },

  SORT_BY(state, sortBy) {
    state.sort = sortBy;
  },
};

export const actions = {
  async loadPages({ commit, dispatch, state }, { nextPage } = {}) {
    const { data } = await this.$axios
      .get('pages', {
        params: {
          page: nextPage || state.currentPage,
          limit: state.itemsPerPage,
          search: state.search,
          sort: state.sort,
        },
      })
      .catch(
        error => dispatch('notifications/error', formatRequestError(error)),
        { root: true }
      );

    return commit('LOAD_PAGES', data);
  },

  async removePage({ commit, dispatch }, pageId) {
    try {
      await dispatch('page/removePage', pageId, { root: true });
    } catch (error) {
      dispatch(
        'notifications/error',
        'Unknown error: Page can not be removed',
        {
          root: true,
        }
      );
    }
  },

  async changePage({ state, dispatch }, targetPage) {
    if (
      targetPage === state.currentPage ||
      targetPage < 1 ||
      targetPage > state.totalPages
    ) {
      return;
    }

    await dispatch('loadPages', { nextPage: targetPage });
  },

  async searchPage({ commit, dispatch }, search) {
    commit('SEARCH_PAGE', search);
    await dispatch('loadPages', { nextPage: 1 });
  },

  async sortBy({ commit, dispatch }, sortBy) {
    commit('SORT_BY', sortBy);
    await dispatch('loadPages');
  },
};
