export const state = () => ({
  types: null,
});

export const mutations = {
  FETCH_PAGE_ATTRIBUTE_TYPES(state, pageAttributeTypes) {
    state.types = pageAttributeTypes;
  },
};

export const actions = {
  async fetchPageAttributeTypes({ commit }) {
    const { data } = await this.$axios.get('page-attribute-types');
    return commit('FETCH_PAGE_ATTRIBUTE_TYPES', data);
  },
};
