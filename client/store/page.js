import { showRequestResult } from '@/utils';

export const state = () => ({
  newPageId: null,
  mainData: null,
  attributesSchema: null,
  pageAttributes: null,
  unsavedData: [],
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

    if (!state.unsavedData.includes('mainData')) {
      state.unsavedData = [...state.unsavedData, 'mainData'];
    }
  },

  UPDATE_ATTRIBUTES(state, pageAttributes) {
    state.pageAttributes = { ...state.pageAttributes, ...pageAttributes };

    if (!state.unsavedData.includes('attributes')) {
      state.unsavedData = [...state.unsavedData, 'attributes'];
    }
  },

  UPDATE_DETAILS(state, pageDetails) {
    state.pageDetails = { ...state.pageDetails, ...pageDetails };

    if (!state.unsavedData.includes('pageDetails')) {
      state.unsavedData = [...state.unsavedData, 'pageDetails'];
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

  RESET_UNSAVED_DATA(state) {
    state.unsavedData = [];
  },
};

export const actions = {
  async fetchPageData({ commit, dispatch, state }, { pageId }) {
    const pageData = await showRequestResult({
      request: this.$axios.get(`pages/${pageId}`),
      dispatch,
    });

    commit('FETCH_PAGE_DATA', pageData);
  },

  async updatePage({ commit, dispatch, state }) {
    const { type, url, name } = state.mainData;

    const updatedMainPageData = await showRequestResult({
      request: this.$axios.put(`pages/${state.mainData._id}`, {
        attributes: state.pageAttributes,
        name,
        pageDetails: state.pageVariants.map(variant => variant._id),
        type: type._id,
        url,
      }),
      dispatch,
    });

    let savedAllData =
      updatedMainPageData && !state.unsavedData.includes('pageDetails');

    if (!savedAllData) {
      const { _id, title, name, description, country } = state.pageDetails;

      const saveDetailsResult = await showRequestResult({
        request: this.$axios.put(`page-details/${_id}`, {
          country,
          description,
          name,
          pageId: state.mainData._id,
          title,
        }),
        dispatch,
      });

      savedAllData = !!saveDetailsResult;
    }

    if (savedAllData) {
      dispatch('notifications/success', 'Saved', { root: true });
      commit('RESET_UNSAVED_DATA');
    }
  },

  async addPage({ commit, dispatch, state }, pageData) {
    const newPageData = await showRequestResult({
      request: this.$axios.post('pages', pageData),
      successMessage: 'Created new page',
      dispatch,
    });

    if (newPageData) {
      commit('ADD_PAGE', newPageData);
    }
  },

  async removePage({ commit, dispatch, state }, pageId) {
    if (!confirm('Please, confirm removing page')) {
      return;
    }

    return await showRequestResult({
      request: this.$axios.delete(`pages/${pageId}`),
      successMessage: 'Page has been removed',
      dispatch,
    });
  },
};
