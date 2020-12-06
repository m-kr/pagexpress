import { showRequestResult } from '@/utils';

export const state = () => ({
  types: null,
});

export const mutations = {
  FETCH_PAGE_TYPES(state, pageTypes) {
    state.types = pageTypes;
  },
};

export const actions = {
  async fetchPageTypes({ commit, dispatch }) {
    const pageTypes = await showRequestResult({
      request: this.$axios.get('page-types'),
      dispatch,
    });

    commit('FETCH_PAGE_TYPES', pageTypes);
  },
};
