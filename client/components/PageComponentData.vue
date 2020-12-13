<template>
  <div class="componentData">
    <Field
      v-for="(field, fieldIndex) in fields"
      :key="fieldIndex"
      :field-type="field.type"
      :label="field.label"
      :options="field.options"
      :value="data && data[field.name] ? data[field.name] : field.defaultValue"
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
