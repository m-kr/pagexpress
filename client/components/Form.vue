<template>
  <form class="form">
    <Field
      v-for="(fieldSchema, fieldName) of formSchema"
      :key="getRandomId(fieldName)"
      :hidden="isHidden(fieldSchema)"
      :field-type="getFieldType(fieldSchema)"
      :label="fieldSchema.label || getFieldLabel(fieldName)"
      :value="getValue(fieldSchema, fieldName)"
      :options="fieldSchema.options"
      :placeholder="fieldSchema.placeholder"
      :update="value => update(fieldName, value)"
      :css-class="`field--${getFieldType(fieldSchema)}`"
    />
  </form>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { Field } from '@/components';

export default {
  name: 'Form',

  components: { Field },

  props: {
    update: {
      type: Function,
      required: true,
    },

    fieldTypes: {
      type: Array,
      default: () => [],
    },

    formSchema: {
      type: Object,
      default: () => {},
    },

    values: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      dataModel: {},
    };
  },

  methods: {
    getValue(fieldSchema, fieldName) {
      return (
        this.values[fieldName] ||
        fieldSchema.defaultValue ||
        fieldSchema.attributes.default
      );
    },

    getFieldType(fieldSchema) {
      if (fieldSchema.type) {
        return fieldSchema.type;
      }

      if (fieldSchema.typeFrom) {
        return this.getFieldTypeFrom(fieldSchema) || '';
      }

      return '';
    },

    getFieldTypeFrom(fieldSchema) {
      if (!(fieldSchema.typeFrom && this.values[fieldSchema.typeFrom])) {
        return null;
      }

      const targetFieldType = this.fieldTypes.find(
        type => type._id === this.values[fieldSchema.typeFrom]
      );

      if (targetFieldType) {
        return targetFieldType.type;
      }

      return null;
    },

    isHidden(fieldSchema) {
      if (fieldSchema.hidden) {
        return true;
      }

      if (fieldSchema.typeFrom && !this.getFieldTypeFrom(fieldSchema)) {
        return true;
      }

      return false;
    },

    getRandomId(fieldName) {
      return `${fieldName}_${uuidv4()}`;
    },

    getFieldLabel(fieldName) {
      return `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`;
    },
  },
};
</script>

<style lang="postcss">
.form {
  display: grid;
  grid-gap: var(--spacing);
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(15em, auto));

  .select,
  select {
    width: 100%;
  }

  .field--boolean,
  .field--html,
  .field--list {
    grid-column: 1/4;
  }
}
</style>
