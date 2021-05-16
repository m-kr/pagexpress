<template>
  <div class="field is-fullwidth">
    <label :for="fieldId" class="label">{{ label }}</label>
    <div class="control">
      <input
        v-if="!options.length"
        :id="fieldId"
        :value="value"
        class="input"
        type="text"
        :placeholder="placeholder"
        @input="onInput"
      />

      <div v-if="options.length" class="select">
        <select
          :id="fieldId"
          :value="value"
          @change="onChange($event.target.value)"
        >
          <option value="">{{ selectPlaceholder }}</option>
          <option
            v-for="(option, index) in options"
            :key="index"
            :value="option.value"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import _debounce from 'lodash/debounce';

export default {
  name: 'FieldText',
  props: {
    label: {
      type: String,
      required: true,
    },

    value: {
      type: String,
      default: '',
    },

    options: {
      type: Array,
      default: () => [],
    },

    placeholder: {
      type: String,
      default: '',
    },
  },

  computed: {
    fieldId() {
      const slug = this.label.replace(/\s/, '-').toLowerCase();
      const uniqueId = uuidv4().replace('-', '');
      return `${slug}_${uniqueId}`;
    },
    selectPlaceholder() {
      return this.placeholder.length ? this.placeholder : '-- Choose option --';
    },
  },

  methods: {
    onChange(value) {
      const correctValue = value.length ? value : undefined;
      this.$emit('update', correctValue);
    },

    onInput: _debounce(function (evt) {
      this.$emit('update', evt.target.value);
    }, 500),
  },
};
</script>
