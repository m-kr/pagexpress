import {
  ComponentPatternModelSchema,
  FieldModelSchema,
  FieldsetModelSchema,
} from '../../server/models/data-schemas';
import { showRequestResult } from '@/utils';

const FIELD_ATTRIBUTES = ['min', 'max', 'required', 'default'];

export const state = () => ({
  newComponentId: null,
  componentPatterns: [],
  activeComponentPattern: null,
  currentPage: 1,
  modelSchemas: {
    componentPattern: ComponentPatternModelSchema(),
    field: FieldModelSchema(),
    fieldset: FieldsetModelSchema(),
  },
  totalPages: 1,
  itemsPerPage: 10,
  search: null,
  sort: '-updatedAt',
});

export const getters = {
  /**
   * @param {object} state
   * @return {function(string): (null|[])}
   */
  formFieldsAttributes: state => schemaName => {
    if (!state.modelSchemas[schemaName]) {
      return null;
    }

    const attributes = {};

    for (const [fieldName, fieldAttributes] of Object.entries(
      state.modelSchemas[schemaName]
    )) {
      const filteredAttributesKeys = Object.keys(
        fieldAttributes
      ).filter(attributeKey => FIELD_ATTRIBUTES.includes(attributeKey));

      attributes[fieldName] = {};

      for (const filteredAttributeKey in filteredAttributesKeys) {
        attributes[fieldName] = {
          ...attributes[fieldName],
          [filteredAttributeKey]: fieldAttributes[filteredAttributeKey],
        };
      }
    }

    return attributes;
  },
};

export const mutations = {
  LOAD_COMPONENT_PATTERNS(
    state,
    { data, currentPage, totalPages, itemsPerPage }
  ) {
    state.componentPatterns = data;
    state.currentPage = currentPage;
    state.totalPages = totalPages;
    state.itemsPerPage = itemsPerPage;
  },

  LOAD_SINGLE_PATTERN(state, componentPattern) {
    state.activeComponentPattern = componentPattern;
  },

  ADD_COMPONENT_PATTERN(state, componentId) {
    state.newComponentId = componentId;
  },

  UPDATE_ACTIVE_COMPONENT_PATTERN(state, componentPatternData) {
    state.activeComponentPattern = componentPatternData;
  },

  REMOVE_COMPONENT_PATTERN(state, componentPatternId) {
    state.componentPatterns = state.componentPatterns.filter(
      componentPattern => componentPattern._id !== componentPatternId
    );
  },

  SEARCH_COMPONENT_PATTERN(state, search) {
    state.search = search;
  },

  SORT_BY(state, sortBy) {
    state.sort = sortBy;
  },
};

export const actions = {
  async fetchComponentPatterns({ commit, dispatch, state }, nextPage) {
    const data = await showRequestResult({
      request: this.$axios.get(`component-patterns`, {
        params: {
          page: nextPage || state.currentPage,
          limit: state.itemsPerPage,
          search: state.search,
        },
      }),
      dispatch,
    });

    if (data) {
      commit('LOAD_COMPONENT_PATTERNS', data);
    }
  },

  async fetchSingleComponentPattern({ commit, dispatch }, componentId) {
    const data = await showRequestResult({
      request: this.$axios.get(`component-patterns/${componentId}`),
      dispatch,
    });

    if (data) {
      commit('LOAD_SINGLE_PATTERN', data);
    }
  },

  async addComponentPattern({ commit, dispatch }, componentData) {
    const componentId = await showRequestResult({
      request: this.$axios.post('component-patterns/', componentData),
      dispatch,
      successMessage: `Added ${componentData.name} component`,
    });

    if (componentId) {
      commit('ADD_COMPONENT', componentId);
    }
  },

  async saveComponentPattern({ store, dispatch }) {
    await showRequestResult({
      request: this.$axios.put(
        `component-patterns/${store.activeComponentPattern._id}`
      ),
      dispatch,
      successMessage: 'Saved changes',
    });
  },

  updateComponentPattern({ commit, store }, newComponentPatternData) {
    commit('UPDATE_ACTIVE_COMPONENT_PATTERN', {
      ...store.activeComponentPattern,
      ...newComponentPatternData,
    });
  },

  async removeComponentPattern(
    { store, dispatch, commit },
    componentPatternId
  ) {
    if (!confirm('Please, confirm removing component')) {
      return;
    }

    await showRequestResult({
      request: this.$axios.delete(`component-patterns/${componentPatternId}`),
      dispatch,
      successMessage: 'Component has been removed',
    });

    commit('REMOVE_COMPONENT_PATTERN', componentPatternId);
  },

  async changePage({ state, dispatch }, targetPage) {
    if (
      targetPage === state.currentPage ||
      targetPage < 1 ||
      targetPage > state.totalPages
    ) {
      return;
    }

    await dispatch('fetchComponentPatterns', targetPage);
  },

  async searchComponentPattern({ commit, dispatch }, search) {
    commit('SEARCH_COMPONENT_PATTERN', search);
    await dispatch('fetchComponentPatterns', 1);
  },

  async sortBy({ commit, dispatch }, sortBy) {
    commit('SORT_BY', sortBy);
    await dispatch('fetchComponentPatterns');
  },
};
