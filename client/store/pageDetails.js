import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
  getAllDescendants,
  getPageStructureFromTemplate,
  showRequestResult,
  remapComponents,
  targetComponentPosition,
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

  ADD_COMPONENTS(state, components) {
    state.components = [...state.components, ...components];
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
    const nodeWithDescendants = getAllDescendants(
      componentId,
      state.components
    );
    state.components = state.components.filter(
      component => !nodeWithDescendants.includes(component._id)
    );
  },

  REMOVE_SINGLE_NODE_COMPONENT(state, targetComponentId) {
    state.components = state.components.filter(
      component => component._id !== targetComponentId
    );
  },

  REMOVE_PAGE_DETAILS(state) {
    state.details = { ...detailsStructure };
    state.components = null;
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

  addComponent({ commit, dispatch }, componentPatternId) {
    commit('ADD_COMPONENT', {
      _id: uuidv4(),
      componentPatternId,
      data: {},
    });

    dispatch('setDirtyState', null, { root: true });
  },

  addComponentInPlace(
    { commit, dispatch },
    {
      componentPatternId,
      targetPlaceIndex,
      parentComponentId,
      componentId,
      data = {},
    }
  ) {
    commit('ADD_COMPONENT_IN_PLACE', {
      placeIndex: targetPlaceIndex,
      componentData: {
        _id: componentId || uuidv4(),
        componentPatternId,
        parentComponentId: parentComponentId || undefined,
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

  removeComponent({ commit, dispatch }, componentId) {
    if (!confirm('Please, confirm removing component')) {
      return;
    }

    commit('REMOVE_COMPONENT', componentId);
    dispatch('setDirtyState', null, { root: true });

    dispatch('notifications/success', 'Component has been removed', {
      root: true,
    });
  },

  copyComponent(
    { state, commit, dispatch },
    { previousComponentId, nextComponentId, parentComponentId, clipboard }
  ) {
    const { payload } = clipboard;

    const nodeWithDescendantsIds = getAllDescendants(
      payload._id,
      state.components
    );
    const descendants = state.components.filter(
      component =>
        payload._id !== component._id &&
        nodeWithDescendantsIds.includes(component._id)
    );
    const rootNodeCopy = { ...payload, _id: uuidv4(), parentComponentId };
    const copiedComponents = remapComponents(descendants).map(component => {
      if (component.parentComponentId === payload._id) {
        component.parentComponentId = rootNodeCopy._id;
      }

      return component;
    });
    const placeIndex = targetComponentPosition({
      components: state.components,
      previousComponentId,
      nextComponentId,
    });

    commit('ADD_COMPONENT_IN_PLACE', {
      placeIndex,
      componentData: rootNodeCopy,
    });
    commit('ADD_COMPONENTS', copiedComponents);
    dispatch('setDirtyState', null, { root: true });
  },

  moveComponent(
    { state, commit, dispatch },
    { previousComponentId, nextComponentId, parentComponentId, clipboard }
  ) {
    const { payload } = clipboard;

    commit('REMOVE_SINGLE_NODE_COMPONENT', payload._id);
    commit('ADD_COMPONENT_IN_PLACE', {
      placeIndex: targetComponentPosition({
        components: state.components,
        previousComponentId,
        nextComponentId,
      }),
      componentData: { ...payload, parentComponentId },
    });

    dispatch('setDirtyState', null, { root: true });
  },
};
