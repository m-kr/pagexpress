import { showRequestResult } from '@/utils';

export const state = () => ({
  definitions: null,
});

export const mutations = {
  FETCH_DEFINITIONS(state, countries) {
    state.definitions = countries;
  },
};

export const actions = {
  async fetchDefinitions({ commit, dispatch, state }, { reload } = {}) {
    if (state.definitions && !reload) {
      return;
    }

    const definitions = await showRequestResult({
      request: this.$axios.get('definitions'),
      dispatch,
    });

    commit('FETCH_DEFINITIONS', definitions);
  },
};
