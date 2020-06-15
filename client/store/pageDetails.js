const detailsStructure = {
  name: '',
  country: '',
  title: '',
  description: '',
};

export const state = () => ({
  details: { ...detailsStructure },
  components: null,
});

export const mutations = {
  FETCH_PAGE_DETAILS(state, { components, ...restDetails }) {
    state.components = components;
    state.details = restDetails;
  },

  UPDATE_PAGE_DETAILS(state, newDetails) {
    state.details = { ...state.details, ...newDetails };
  },

  RESET_DETAILS(state) {
    state.details = { ...detailsStructure };
  },

  REMOVE_PAGE_DETAILS(state) {
    state.details = { ...detailsStructure };
    state.components = null;
  },
};

export const actions = {
  async fetchPageDetails({ commit, state }, pageDetailsId) {
    const { data } = await this.$axios.get(`page-details/${pageDetailsId}`);
    return commit('FETCH_PAGE_DETAILS', data);
  },

  async addPageDetails({ commit, state }, pageId) {
    try {
      const { data } = await this.$axios.post(`page-details`, {
        pageId,
        ...state.details,
      });
      commit(
        'page/ADD_VARIANT',
        {
          _id: data,
          ...state.details,
        },
        { root: true }
      );
      commit('RESET_DETAILS');
    } catch (error) {
      // eslint-disable-next-line
      console.error(`Error code ${error.response.status}: ${error.response.data}`);
    }
  },

  async savePageDetails({ commit, state }) {
    try {
      await this.$axios.put(`page-details/${state.details._id}`, state.details);

      commit('RESET_DETAILS');
    } catch (error) {
      // eslint-disable-next-line
      console.error(`Error code ${error.response.status}: ${error.response.data}`);
    }
  },

  async removePageDetails({ commit, state }) {
    const { data } = await this.$axios.delete(`page-details`, state.details);
    return commit('REMOVE_PAGE_DETAILS', data);
  },
};
