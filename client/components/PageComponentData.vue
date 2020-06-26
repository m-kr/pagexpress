<template>
  <div class="componentData">
    <div
      v-for="(field, fieldIndex) in fields"
      :key="fieldIndex"
      class="field-wrapper"
    >
      <FieldText
        :label="field.name"
        :value="data[field.name]"
        @update="value => updateData(field.name, value)"
      />
    </div>
  </div>
</template>

<script>
import FieldText from './FieldText';

export default {
  name: 'PageComponentData',

  components: {
    FieldText,
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
