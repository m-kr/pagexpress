export const state = () => ({
  mainData: null,
  attributesSchema: null,
  pageAttributes: null,
  unsaveData: [],
  pageDetails: null,
  pageVariants: null,
});

export const mutations = {
  FETCH_PAGE_DATA(state, { data, attributesSchema }) {
    state.mainData = data;
    state.pageAttributes = data.attributes;
    state.pageVariants = data.pageDetails;
    state.attributesSchema = attributesSchema;
  },

  UPDATE_MAIN_DATA(state, data) {
    state.mainData = { ...state.mainData, ...data };

    if (!state.unsaveData.includes('mainData')) {
      state.unsaveData = [...state.unsaveData, 'mainData'];
    }
  },

  UPDATE_ATTRIBUTES(state, pageAttributes) {
    state.pageAttributes = { ...state.pageAttributes, ...pageAttributes };

    if (!state.unsaveData.includes('attributes')) {
      state.unsaveData = [...state.unsaveData, 'attributes'];
    }
  },

  UPDATE_DETAILS(state, pageDetails) {
    state.pageData = { ...state.pageDetails, ...pageDetails };

    if (!state.unsaveData.includes('pageDetails')) {
      state.unsaveData = [...state.unsaveData, 'pageDetails'];
    }
  },

  RESET_UNSAVE_DATA(state) {
    state.unsaveData = [];
  },
};

export const actions = {
  async fetchPageData({ commit, state }, { pageId, reload }) {
    if (state.pageData && !reload) {
      return;
    }

    try {
      const { data } = await this.$axios.get(`pages/${pageId}`);

      return commit('FETCH_PAGE_DATA', data);
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  },

  async savePage({ commit, state }) {
    try {
      await this.$axios.put(`pages/${state.mainData._id}`, {
        ...state.mainData,
        attributes: state.pageAttributes,
        pageDetails: state.pageVariants.map(variant => variant._id),
      });

      if (state.unsaveData.includes('pageDetails')) {
        await this.$axios.put(
          `page-details/${state.mainData._id}`,
          state.pageDetails
        );
      }

      return commit('RESET_UNSAVE_DATA');
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  },

  async addPage({ commit, state }) {
    const { _id, ...pageData } = state;
    await this.$axios.post(`pages`, pageData);

    return commit('RESET_UNSAVE_DATA');
  },

  async removePage({ commit, state }, pageId) {
    const { data } = await this.$axios.delete(`pages/${pageId}`);

    if (data) {
      return commit('REMOVE_PAGE', pageId);
    }
  },
};
