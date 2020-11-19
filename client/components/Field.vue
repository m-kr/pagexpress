<template>
  <div :class="cssClass" class="field-wrapper">
    <FieldText
      v-if="fieldType === 'text'"
      :label="label"
      :options="options"
      :value="value || null"
      @update="update"
    />

    <FieldHtml
      v-if="fieldType === 'html'"
      :label="label"
      :value="value || null"
      @update="update"
    />

    <FieldList
      v-if="fieldType === 'list'"
      :label="label"
      :options="options"
      :values="value || []"
      @update="update"
    />

    <FieldBoolean
      v-if="fieldType === 'boolean'"
      :label="label"
      :value="value || false"
      @update="update"
    />
  </div>
</template>

<script>
import { FieldBoolean, FieldHtml, FieldList, FieldText } from './FieldTypes';

export default {
  name: 'Field',

  components: {
    FieldBoolean,
    FieldHtml,
    FieldList,
    FieldText,
  },

  props: {
    cssClass: {
      type: String,
      default: '',
    },

    fieldType: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    value: {
      type: [String, Array, Boolean],
      default: null,
    },

    options: {
      type: Array,
      default: () => [],
    },

    placeholder: {
      type: String,
      default: '',
    },

    update: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style lang="postcss" scoped>
.field-wrapper {
  &:not(:first-of-type) {
    margin-top: var(--spacing);
  }
}
</style>