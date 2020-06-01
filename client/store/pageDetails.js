export const state = () => ({
  details: null,
  components: null,
});

export const mutations = {
  FETCH_PAGE_DETAILS(state, { components, ...restDetails }) {
    state.components = components;
    state.details = restDetails;
  },
};

export const actions = {
  async fetchPageDetails({ commit, state }, pageDetailsId) {
    const { data } = await this.$axios.get(`page-details/${pageDetailsId}`);
    return commit('FETCH_PAGE_DETAILS', data);
  },
};
