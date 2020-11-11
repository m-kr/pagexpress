<template>
  <div v-if="fieldTypes && fieldTypes.length" class="componentData">
    <Field
      v-for="(field, fieldIndex) in fields"
      :key="fieldIndex"
      :field-type="getFieldType(field.fieldTypeId)"
      :label="field.label"
      :options="field.options"
      :value="data ? data[field.name] : null"
      :update="value => updateData(field.name, value)"
    />
  </div>
</template>

<script>
import Field from './Field';

export default {
  name: 'PageComponentData',

  components: {
    Field,
  },

  props: {
    fieldTypes: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
    onUpdateData: {
      type: Function,
      required: true,
    },
  },

  methods: {
    updateData(fieldName, value) {
      this.onUpdateData(fieldName, value);
    },

    getFieldType(fieldTypeId) {
      return this.fieldTypes.find(field => field._id === fieldTypeId).type;
    },
  },
};
</script>
