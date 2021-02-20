import _omit from 'lodash/omit';
import Vue from 'vue';
import { v4 as uuidv4 } from 'uuid';
import {
  ComponentPatternModelSchema,
  FieldModelSchema,
  FieldOptionModelSchema,
  FieldsetModelSchema,
} from '../../server/models/data-schemas';
import { reorderItems, showRequestResult } from '@/utils';

const FIELD_ATTRIBUTES = ['min', 'max', 'required', 'default'];

export const state = () => ({
  componentId: null,
  componentPatterns: [],
  componentPatternMainData: {},
  componentPatternFields: null,
  componentPatternFieldset: null,
  currentPage: 1,
  modelSchemas: {
    componentPattern: ComponentPatternModelSchema(),
    field: FieldModelSchema(),
    fieldOption: FieldOptionModelSchema(),
    fieldset: FieldsetModelSchema(),
  },
  fieldTypes: null,
  definitions: null,
  unsavedState: false,
  totalPages: 1,
  itemsPerPage: 25,
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

      for (const filteredAttributeKey of filteredAttributesKeys) {
        attributes[fieldName] = {
          ...attributes[fieldName],
          [filteredAttributeKey]: fieldAttributes[filteredAttributeKey],
        };
      }
    }

    return attributes;
  },

  newField(state, getters) {
    const newField = {};
    const fieldSchema = getters.formFields;

    for (const fieldName of Object.keys(fieldSchema)) {
      if (fieldSchema[fieldName].defaultValue) {
        newField[fieldName] = fieldSchema[fieldName].defaultValue;
      }
    }

    return newField;
  },

  formMainParameters(state, getters) {
    const fieldsAttributes = getters.formFieldsAttributes('componentPattern');

    return {
      name: {
        type: 'text',
        label: 'Name (Upper CamelCase)',
        attributes: fieldsAttributes.name,
      },
      label: {
        type: 'text',
        attributes: fieldsAttributes.label,
      },
      description: {
        type: 'text',
        attributes: fieldsAttributes.description,
      },
    };
  },

  formFields(state, getters) {
    const fieldsAttributes = getters.formFieldsAttributes('field');
    const fieldOptionsAttributes = getters.formFieldsAttributes('fieldOption');

    return {
      required: {
        type: 'boolean',
        attributes: fieldsAttributes.required,
      },
      fieldTypeId: {
        label: 'Field type',
        type: 'text',
        defaultValue: getters.getDefaultFieldType,
        hidden: !getters.fieldTypesOptions,
        options: getters.fieldTypesOptions,
        attributes: fieldsAttributes.fieldTypeId,
      },
      name: {
        label: 'Name (camelCase)',
        type: 'text',
        attributes: fieldsAttributes.name,
      },
      label: {
        type: 'text',
        attributes: fieldsAttributes.label,
      },
      description: {
        type: 'text',
        attributes: fieldsAttributes.description,
      },
      defaultValue: {
        label: 'Default value',
        typeFrom: 'fieldTypeId',
        attributes: fieldsAttributes.defaultValue,
      },
      definedOptionsId: {
        label: 'Options from global definition',
        type: 'text',
        attributes: fieldsAttributes.definedOptionsId,
        hidden: !getters.definitionsOptions,
        options: getters.definitionsOptions,
      },
      options: {
        label: 'Custom options',
        type: 'fieldsGroup',
        attributes: fieldsAttributes.options,
        hideWhenFieldValue: 'definedOptionsId',
        fields: {
          name: {
            type: 'text',
            attributes: fieldOptionsAttributes.name,
          },
          value: {
            type: 'text',
            attributes: fieldOptionsAttributes.value,
          },
        },
      },
    };
  },

  formFieldset(state, getters) {
    const fieldsetAttributes = getters.formFieldsAttributes('fieldset');

    return {
      required: {
        type: 'boolean',
        attributes: fieldsetAttributes.required,
      },
      name: {
        type: 'text',
        label: 'Name (camelCase)',
        attributes: fieldsetAttributes.name,
      },
      label: {
        type: 'text',
        attributes: fieldsetAttributes.label,
      },
      description: {
        type: 'text',
        attributes: fieldsetAttributes.description,
      },
    };
  },

  fieldTypesOptions(state) {
    if (!state.fieldTypes) {
      return null;
    }

    return state.fieldTypes.map(fieldType => ({
      name: fieldType.type,
      value: fieldType._id,
    }));
  },

  getDefaultFieldType(state) {
    if (!state.fieldTypes) {
      return null;
    }

    return state.fieldTypes.find(fieldType => fieldType.type === 'text')._id;
  },

  definitionsOptions(state) {
    if (!state.definitions) {
      return null;
    }

    return state.definitions.map(({ name, _id }) => ({
      name,
      value: _id,
    }));
  },

  componentData({
    componentPatternMainData,
    componentPatternFields,
    componentPatternFieldset,
  }) {
    return {
      ...componentPatternMainData,
      fields: componentPatternFields || [],
      fieldset: componentPatternFieldset || [],
    };
  },

  randomId() {
    return uuidv4();
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

  LOAD_SINGLE_PATTERN(state, { _id, fields, fieldset, ...mainData }) {
    state.componentPatternMainData = _omit(mainData, ['_id', '__v']);
    state.componentPatternFields = fields
      ? fields.map(field => _omit(field, ['_id']))
      : null;
    state.componentPatternFieldset = fieldset
      ? fieldset.map(singleFieldset => ({
          ..._omit(singleFieldset, ['_id']),
          fields: singleFieldset.fields.map(field => _omit(field, ['_id'])),
        }))
      : null;
    state.componentId = _id;
  },

  LOAD_ADD_COMPONENT_VIEW_DATA(state, { fieldTypes, definitions }) {
    state.fieldTypes = fieldTypes;
    state.definitions = definitions;
  },

  RESET_ADD_COMPONENT_STATE(state) {
    state.componentPatternMainData = {};
    state.componentPatternFields = null;
    state.componentPatternFieldset = null;
    state.unsavedState = false;
  },

  ADD_COMPONENT_PATTERN(state, componentId) {
    state.componentId = componentId;
  },

  UPDATE_MAIN_PARAMETERS(state, { fieldName, value }) {
    Vue.set(state.componentPatternMainData, fieldName, value);
  },

  UPDATE_FIELD_VALUE(state, { fieldIndex, fieldName, value }) {
    state.componentPatternFields.splice(fieldIndex, 1, {
      ...state.componentPatternFields[fieldIndex],
      [fieldName]: value,
    });
  },

  UPDATE_FIELDS(state, fields) {
    state.componentPatternFields = [...fields];
  },

  UPDATE_ALL_FIELDSET(state, fieldset) {
    state.componentPatternFieldset = [...fieldset];
  },

  UPDATE_FIELDSET(state, { fieldsetIndex, fieldName, value }) {
    state.componentPatternFieldset.splice(fieldsetIndex, 1, {
      ...state.componentPatternFieldset[fieldsetIndex],
      [fieldName]: value,
    });
  },

  UPDATE_FIELDSET_FIELD_VALUE(
    state,
    { fieldsetIndex, fieldIndex, fieldName, value }
  ) {
    state.componentPatternFieldset[fieldsetIndex].fields.splice(fieldIndex, 1, {
      ...state.componentPatternFieldset[fieldsetIndex].fields[fieldIndex],
      [fieldName]: value,
    });
  },

  UNSAVED_STATE(state, unsavedChanges = true) {
    state.unsavedState = unsavedChanges;
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
  async fetchComponentPatterns(
    { commit, dispatch, state },
    { itemsPerPage, nextPage } = {}
  ) {
    const data = await showRequestResult({
      request: this.$axios.get(`component-patterns`, {
        params: {
          page: nextPage || state.currentPage,
          limit: itemsPerPage === null ? undefined : state.itemsPerPage,
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
      request: this.$axios.get(`component-patterns/${componentId}`, {
        params: {
          plainData: true,
        },
      }),
      dispatch,
    });

    if (data) {
      commit('LOAD_SINGLE_PATTERN', data);
    }
  },

  async initAddComponentViewData({ commit, dispatch, rootState }) {
    await dispatch(
      'definitions/fetchDefinitions',
      {},
      {
        root: true,
      }
    );
    await dispatch(
      'fieldTypes/fetchFieldTypes',
      {},
      {
        root: true,
      }
    );

    commit('RESET_ADD_COMPONENT_STATE');
    commit('LOAD_ADD_COMPONENT_VIEW_DATA', {
      definitions: rootState.definitions.definitions,
      fieldTypes: rootState.fieldTypes.types,
    });
  },

  async initEditComponentViewData(
    { commit, dispatch, rootState },
    componentId
  ) {
    await dispatch('fetchSingleComponentPattern', componentId);
    await dispatch(
      'definitions/fetchDefinitions',
      {},
      {
        root: true,
      }
    );
    await dispatch(
      'fieldTypes/fetchFieldTypes',
      {},
      {
        root: true,
      }
    );

    commit('LOAD_ADD_COMPONENT_VIEW_DATA', {
      definitions: rootState.definitions.definitions,
      fieldTypes: rootState.fieldTypes.types,
    });
  },

  async addComponentPattern({ getters, dispatch, commit }) {
    const componentId = await showRequestResult({
      request: this.$axios.post('component-patterns', getters.componentData),
      dispatch,
      successMessage: `Added ${getters.componentData.name} component`,
    });

    if (componentId) {
      commit('ADD_COMPONENT_PATTERN', componentId);
      commit('RESET_ADD_COMPONENT_STATE');
    }
  },

  async updateComponentPattern({ state, dispatch, getters, commit }) {
    const data = await showRequestResult({
      request: this.$axios.put(
        `component-patterns/${state.componentId}`,
        getters.componentData
      ),
      dispatch,
      successMessage: 'Saved changes',
    });

    if (data) {
      commit('UNSAVED_STATE', false);
    }
  },

  updateComponentPatternMainParameters({ commit }, mainParameters) {
    commit('UPDATE_MAIN_PARAMETERS', mainParameters);
    commit('UNSAVED_STATE');
  },

  updateComponentPatternField({ commit }, updatedFieldParameters) {
    commit('UPDATE_FIELD_VALUE', updatedFieldParameters);
    commit('UNSAVED_STATE');
  },

  updateComponentPatternFieldsetField({ commit }, updatedFieldParameters) {
    commit('UPDATE_FIELDSET_FIELD_VALUE', updatedFieldParameters);
    commit('UNSAVED_STATE');
  },

  addField({ commit, state, getters }) {
    commit('UPDATE_FIELDS', [
      ...(state.componentPatternFields || []),
      getters.newField,
    ]);
  },

  addFieldset({ commit, state, getters }) {
    commit('UPDATE_ALL_FIELDSET', [
      ...(state.componentPatternFieldset || []),
      {
        fields: [getters.newField],
      },
    ]);
  },

  addFieldsetField({ commit, state }, fieldsetIndex) {
    commit('UPDATE_FIELDSET', {
      fieldsetIndex,
      fieldName: 'fields',
      value: [...state.componentPatternFieldset[fieldsetIndex].fields, {}],
    });
  },

  updateFieldsetData({ commit }, updateFieldsetData) {
    commit('UPDATE_FIELDSET', updateFieldsetData);
    commit('UNSAVED_STATE');
  },

  reorderFields({ commit, state }, dropResult) {
    const newFields = [...state.componentPatternFields];
    commit('UPDATE_FIELDS', reorderItems(newFields, dropResult));
    commit('UNSAVED_STATE');
  },

  reorderFieldsetFields({ commit, state }, { fieldsetIndex, dropResult }) {
    const newFields = [...state.componentPatternFieldset[fieldsetIndex].fields];
    commit('UPDATE_FIELDSET', {
      fieldsetIndex,
      fieldName: 'fields',
      value: reorderItems(newFields, dropResult),
    });
    commit('UNSAVED_STATE');
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

    await dispatch('fetchComponentPatterns', { targetPage });
  },

  async searchComponentPattern({ commit, dispatch }, search) {
    commit('SEARCH_COMPONENT_PATTERN', search);
    await dispatch('fetchComponentPatterns', { targetPage: 1 });
  },

  async sortBy({ commit, dispatch }, sortBy) {
    commit('SORT_BY', sortBy);
    await dispatch('fetchComponentPatterns');
  },
};
