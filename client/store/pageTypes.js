export const state = () => ({
  types: null,
});

export const mutations = {
  FETCH_PAGE_TYPES(state, pageTypes) {
    state.types = pageTypes;
  },
};

export const actions = {
  async fetchPageTypes({ commit }) {
    const { data } = await this.$axios.get('page-types');
    return commit('FETCH_PAGE_TYPES', data);
  },
};
