export const state = () => ({
  patterns: null,
});

export const mutations = {
  FETCH_PATTERNS(state, patterns) {
    state.patterns = patterns;
  },
};

export const actions = {
  async fetchPatterns({ commit, state }) {
    if (state.patterns) {
      return;
    }

    const { data } = await this.$axios.get('component-patterns');

    return commit('FETCH_PATTERNS', data);
  },
};
