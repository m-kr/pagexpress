<template>
  <div v-if="fieldTypes && fieldTypes.length" class="componentData">
    <div
      v-for="(field, fieldIndex) in fields"
      :key="fieldIndex"
      class="field-wrapper"
    >
      <FieldText
        v-if="isFieldType(field.fieldTypeId, 'text')"
        :label="field.label"
        :value="data ? data[field.name] : null"
        @update="value => updateData(field.name, value)"
      />

      <FieldHtml
        v-if="isFieldType(field.fieldTypeId, 'html')"
        :label="field.label"
        :value="data ? data[field.name] : null"
        @update="value => updateData(field.name, value)"
      />

      <FieldList
        v-if="isFieldType(field.fieldTypeId, 'list')"
        :label="field.label"
        :values="data ? data[field.name] : null"
        @update="value => updateData(field.name, value)"
      />
    </div>
  </div>
</template>

<script>
import FieldText from './FieldText';
import FieldHtml from './FieldHtml';
import FieldList from './FieldList';

export default {
  name: 'PageComponentData',

  components: {
    FieldHtml,
    FieldText,
    FieldList,
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

    isFieldType(fieldTypeId, targetTypeName) {
      const fieldType = this.fieldTypes.find(
        field => field._id === fieldTypeId
      );

      return fieldType.type === targetTypeName;
    },
  },
};
</script>

<style scoped>
.field-wrapper {
  &:not(:first-of-type) {
    margin-top: var(--spacing);
  }
}
</style>
