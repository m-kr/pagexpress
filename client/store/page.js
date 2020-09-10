import { formatRequestError } from '@/utils';

export const state = () => ({
  newPageId: null,
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

  ADD_PAGE(state, newPageId) {
    state.newPageId = newPageId;
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
  async fetchPageData({ commit, dispatch, state }, { pageId, reload }) {
    if (state.pageData && !reload) {
      return;
    }

    const { data } = await this.$axios.get(`pages/${pageId}`).catch(
      error =>
        dispatch('notifications/error', formatRequestError(error), {
          root: true,
        }),
      { root: true }
    );

    commit('FETCH_PAGE_DATA', data);
  },

  async updatePage({ commit, dispatch, state }) {
    const { type, url, name } = state.mainData;

    await this.$axios
      .put(`pages/${state.mainData._id}`, {
        attributes: state.pageAttributes,
        name,
        pageDetails: state.pageVariants.map(variant => variant._id),
        type: type._id,
        url,
      })
      .catch(
        error =>
          dispatch('notifications/error', formatRequestError(error), {
            root: true,
          }),
        { root: true }
      );

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

    dispatch('notifications/success', 'Saved', { root: true });
    commit('RESET_UNSAVE_DATA');
  },

  async addPage({ commit, dispatch, state }, pageData) {
    const { data } = await this.$axios.post(`pages`, pageData).catch(
      error =>
        dispatch('notifications/error', formatRequestError(error), {
          root: true,
        }),
      { root: true }
    );

    if (data) {
      dispatch('notifications/success', 'Created page', { root: true });
      commit('ADD_PAGE', data);
    }
  },

  async removePage({ commit, dispatch, state }, pageId) {
    if (!confirm('Please, confirm removing page')) {
      return;
    }

    const { data } = await this.$axios.delete(`pages/${pageId}`).catch(
      error =>
        dispatch('notifications/error', formatRequestError(error), {
          root: true,
        }),
      { root: true }
    );

    if (data) {
      commit('REMOVE_PAGE', pageId);
      dispatch('notifications/success', 'Removed page', { root: true });

      return true;
    } else {
      dispatch(
        'notifications/error',
        'Unknown error: Page can not be removed',
        {
          root: true,
        }
      );
    }
  },
};
