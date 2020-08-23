import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const detailsStructure = {
  _id: '',
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
  FETCH_PAGE_DETAILS(state, { components, ...details }) {
    state.components = components;
    state.details = _.pick(details, [
      '_id',
      'name',
      'country',
      'title',
      'description',
      'pageId',
    ]);
  },

  UPDATE_PAGE_DETAILS(state, newDetails) {
    state.details = { ...state.details, ...newDetails };
  },

  RESET_DETAILS(state) {
    state.details = { ...detailsStructure };
  },

  ADD_COMPONENT(state, component) {
    state.components = [...state.components, component];
  },

  UPDATE_COMPONENT(state, newComponentData) {
    state.components = state.components.map(component => {
      if (component._id === newComponentData._id) {
        component = { ...component, ...newComponentData };
      }

      return component;
    });
  },

  UPDATE_ALL_COMPONENTS(state, components) {
    state.components = components;
  },

  REMOVE_COMPONENT(state, componentId) {
    state.components = state.components.filter(
      component => component._id !== componentId
    );
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
        ..._.pickBy(state.details, (value, key) => key !== '_id'),
      });
      commit(
        'page/ADD_VARIANT',
        {
          ...state.details,
          _id: data,
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
    const components = [...state.components];

    try {
      await this.$axios.put(`page-details/${state.details._id}`, {
        ..._.pickBy(state.details, (value, key) => key !== '_id'),
        components,
      });

      commit('RESET_DETAILS');
    } catch (error) {
      // eslint-disable-next-line
      console.error(`Error code ${error.response.status}: ${error.response.data}`);
    }
  },

  async removePageDetails({ commit, state }, pageDetailsId) {
    await this.$axios.delete(`page-details/${pageDetailsId}`);
    commit('page/REMOVE_VARIANT', pageDetailsId, { root: true });
    commit('REMOVE_PAGE_DETAILS');
  },

  addComponent({ commit, state }, newComponentData) {
    commit('ADD_COMPONENT', {
      _id: uuidv4(),
      ...newComponentData,
      data: {},
    });
  },

  reorderComponents({ commit, state }, { oldIndex, newIndex }) {
    const reorderedComponents = [...state.components];
    const movedElement = reorderedComponents[oldIndex];
    reorderedComponents.splice(oldIndex, 1);
    reorderedComponents.splice(newIndex, 0, movedElement);

    commit('UPDATE_ALL_COMPONENTS', reorderedComponents);
  },
};
