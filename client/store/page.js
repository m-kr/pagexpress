export const state = () => ({
  mainData: null,
  attributesSchema: null,
  pageAttributes: null,
  unsaveData: [],
  pageVariants: null,
  pageDetails: {},
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
    state.pageDetails = { ...state.pageDetails, ...pageDetails };

    if (!state.unsaveData.includes('pageDetails')) {
      state.unsaveData = [...state.unsaveData, 'pageDetails'];
    }
  },

  ADD_VARIANT(state, variant) {
    state.pageVariants = [variant, ...state.pageVariants];
    state.pageDetails = variant;
  },

  REMOVE_VARIANT(state, variantId) {
    state.pageVariants = state.pageVariants.filter(
      variant => variant._id !== variantId
    );

    if (state.pageVariants.length) {
      state.pageDetails = state.pageVariants[0];
    } else {
      state.pageDetails = {};
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
      console.error(`Error code ${error.response.status}: ${error.response.data}`);
    }
  },

  async updatePage({ commit, state }) {
    try {
      const { type, url, name } = state.mainData;

      await this.$axios.put(`pages/${state.mainData._id}`, {
        attributes: state.pageAttributes,
        name,
        pageDetails: state.pageVariants.map(variant => variant._id),
        type: type._id,
        url,
      });

      if (state.unsaveData.includes('pageDetails')) {
        const { _id, title, name, description, country } = state.pageDetails;

        await this.$axios.put(`page-details/${_id}`, {
          country,
          description,
          name,
          pageId: state.mainData._id,
          title,
        });
      }

      return commit('RESET_UNSAVE_DATA');
    } catch (error) {
      // eslint-disable-next-line
      console.error(`Error code ${error.response.status}: ${error.response.data}`);
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
