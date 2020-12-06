import { showRequestResult } from '@/utils';

export const state = () => ({
  types: null,
});

export const mutations = {
  FETCH_FIELD_TYPES(state, fieldTypes) {
    state.types = fieldTypes;
  },
};

export const actions = {
  async fetchFieldTypes({ commit, dispatch }) {
    const fieldTypes = await showRequestResult({
      request: this.$axios.get('field-types'),
      dispatch,
    });

    commit('FETCH_FIELD_TYPES', fieldTypes);
  },
};
