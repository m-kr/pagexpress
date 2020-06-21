export const state = () => ({
  types: null,
});

export const mutations = {
  FETCH_FIELD_TYPES(state, fieldTypes) {
    state.types = fieldTypes;
  },
};

export const actions = {
  async fetchFieldTypes({ commit }) {
    const { data } = await this.$axios.get('field-types');
    return commit('FETCH_FIELD_TYPES', data);
  },
};
