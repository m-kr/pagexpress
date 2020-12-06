import { showRequestResult } from '@/utils';

export const state = () => ({
  templates: [],
});

export const mutations = {
  FETCH_TEMPLATES(state, templates) {
    state.templates = templates;
  },
};

export const actions = {
  async fetchTemplates({ commit, dispatch }) {
    const templates = await showRequestResult({
      request: this.$axios.get('page-templates'),
      dispatch,
    });

    commit('FETCH_TEMPLATES', templates);
  },
};
