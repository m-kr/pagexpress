import { showRequestResult } from '@/utils';

export const state = () => ({
  patterns: null,
});

export const mutations = {
  FETCH_PATTERNS(state, patterns) {
    state.patterns = patterns;
  },
};

export const actions = {
  async fetchPatterns({ commit, dispatch }) {
    const patterns = await showRequestResult({
      request: this.$axios.get('component-patterns'),
      dispatch,
    });

    commit('FETCH_PATTERNS', patterns);
  },
};
