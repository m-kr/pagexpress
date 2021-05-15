import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
  getPageStructureFromTemplate,
  showRequestResult,
  reorderItems,
} from '@/utils';

const saveChangesDelay = 500;
let lastUpdateComponentSaveTimeout = null;

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
  isDirty: false,
});

export const getters = {
  rootComponents: state =>
    state.components.filter(component => !component.parentComponentId),

  /**
   * @return {number} component position (index)
   */
  componentPosition: state => componentId =>
    state.components.findIndex(component => component._id === componentId),
};

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

  ADD_COMPONENT_IN_PLACE(state, { placeIndex, componentData }) {
    state.components.splice(placeIndex, 0, componentData);
  },

  UPDATE_COMPONENT(state, newComponentData) {
    state.components = state.components.map(component => {
      if (component._id === newComponentData._id) {
        component = { ...component, ...newComponentData };
      }

      return component;
    });
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

  REORDER_COMPONENTS(state, dragResults) {
    state.components = [...reorderItems(state.components, dragResults)];
  },
};

export const actions = {
  async fetchPageDetails({ commit, dispatch }, pageDetailsId) {
    const pageDetailsData = await showRequestResult({
      request: this.$axios.get(`page-details/${pageDetailsId}`),
      dispatch,
    });

    if (pageDetailsData) {
      commit('FETCH_PAGE_DETAILS', pageDetailsData);
    }
  },

  async addPageDetails(
    { commit, dispatch, state },
    { pageId, templateComponents }
  ) {
    const pageDetailsId = await showRequestResult({
      request: this.$axios.post(`page-details`, {
        ..._.pickBy(state.details, (value, key) => key !== '_id'),
        components: getPageStructureFromTemplate(templateComponents),
        pageId,
      }),
      successMessage: 'Added page variant',
      dispatch,
    });

    if (pageDetailsId) {
      commit(
        'page/ADD_VARIANT',
        {
          ...state.details,
          _id: pageDetailsId,
        },
        { root: true }
      );
      commit('RESET_DETAILS');
    }
  },

  async savePageDetails({ state, dispatch }) {
    const components = [...state.components];
    const data = await showRequestResult({
      request: this.$axios.put(`page-details/${state.details._id}`, {
        ..._.pickBy(state.details, (value, key) => key !== '_id'),
        components,
      }),
      dispatch,
    });

    if (data) {
      dispatch('resetDirtyState', null, { root: true });
    }
  },

  async removePageDetails({ commit, dispatch }, pageDetailsId) {
    if (!confirm('Please, confirm removing page variant')) {
      return;
    }

    const removedPageDetailsId = await showRequestResult({
      request: this.$axios.delete(`page-details/${pageDetailsId}`),
      successMessage: 'Removed page variant',
      dispatch,
    });

    if (removedPageDetailsId) {
      commit('page/REMOVE_VARIANT', pageDetailsId, { root: true });
      commit('REMOVE_PAGE_DETAILS');
    }
  },

  addComponent({ commit, dispatch }, newComponentData) {
    commit('ADD_COMPONENT', {
      _id: uuidv4(),
      ...newComponentData,
      data: {},
    });

    dispatch('setDirtyState', null, { root: true });
  },

  addComponentInPlace(
    { commit, dispatch },
    { componentPatternId, targetPlaceIndex, parentComponentId, data = {} }
  ) {
    commit('ADD_COMPONENT_IN_PLACE', {
      placeIndex: targetPlaceIndex,
      componentData: {
        _id: uuidv4(),
        componentPatternId,
        parentComponentId,
        data,
      },
    });

    dispatch('setDirtyState', null, { root: true });
  },

  updateComponent({ commit, dispatch }, componentData) {
    commit('UPDATE_COMPONENT', componentData);

    if (lastUpdateComponentSaveTimeout) {
      clearTimeout(lastUpdateComponentSaveTimeout);
    }

    lastUpdateComponentSaveTimeout = setTimeout(
      () => dispatch('setDirtyState', null, { root: true }),
      saveChangesDelay
    );
  },

  removeComponent({ commit, dispatch }, { componentId, silent = false }) {
    if (!silent && !confirm('Please, confirm removing component')) {
      return;
    }

    commit('REMOVE_COMPONENT', componentId);
    dispatch('setDirtyState', null, { root: true });

    if (!silent) {
      dispatch('notifications/success', 'Component has been removed', {
        root: true,
      });
    }
  },

  reorderComponents(
    { commit, dispatch, state },
    { addedItemId, removedItemId }
  ) {
    let addedIndex = null;
    let removedIndex = null;

    for (let i = 0; i < state.components.length; i++) {
      const component = state.components[i];

      if (component._id === addedItemId) {
        addedIndex = i;
      }

      if (component._id === removedItemId) {
        removedIndex = i;
      }

      if (addedIndex !== null && removedIndex !== null) {
        break;
      }
    }
    commit('REORDER_COMPONENTS', {
      addedIndex,
      removedIndex,
    });
    dispatch('setDirtyState', null, { root: true });
  },

  reorderRootComponents(
    { commit, dispatch, state, getters },
    { removedIndex, addedIndex, payload }
  ) {
    const { rootComponents } = getters;
    const { components } = state;
    let addedComponentIndex = null;
    let removedComponentIndex = null;

    for (const [index, component] of components.entries()) {
      if (
        addedIndex !== null &&
        rootComponents[addedIndex]._id === component._id
      ) {
        addedComponentIndex = index;
      }

      if (
        removedIndex !== null &&
        rootComponents[removedIndex]._id === component._id
      ) {
        removedComponentIndex = index;
      }

      if (
        (addedIndex === null || addedComponentIndex) &&
        (removedIndex === null || removedComponentIndex)
      ) {
        break;
      }
    }

    commit('REORDER_COMPONENTS', {
      addedIndex: addedComponentIndex,
      removedIndex: removedComponentIndex,
      payload,
    });

    dispatch('setDirtyState', null, { root: true });
  },
};
