export const state = () => ({
  templates: [],
});

export const mutations = {
  FETCH_TEMPLATES(state, templates) {
    state.templates = templates;
  },
};

export const actions = {
  async fetchTemplates({ commit }) {
    const { data } = await this.$axios.get('page-templates');
    return commit('FETCH_TEMPLATES', data);
  },
};
