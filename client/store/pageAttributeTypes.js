import { showRequestResult } from '@/utils';

export const state = () => ({
  types: null,
});

export const mutations = {
  FETCH_PAGE_ATTRIBUTE_TYPES(state, pageAttributeTypes) {
    state.types = pageAttributeTypes;
  },
};

export const actions = {
  async fetchPageAttributeTypes({ commit, dispatch }) {
    const pageAttributeTypes = await showRequestResult({
      request: this.$axios.get('page-attribute-types'),
      dispatch,
    });

    if (pageAttributeTypes) {
      commit('FETCH_PAGE_ATTRIBUTE_TYPES', pageAttributeTypes);
    }
  },
};
