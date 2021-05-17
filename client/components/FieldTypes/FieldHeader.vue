<template>
  <div class="field is-fullwidth">
    <label :for="fieldId" class="label">{{ label }}</label>
    <div class="field-body">
      <div class="control">
        <input
          :id="fieldId"
          :value="value.text"
          class="input"
          type="text"
          @input="onInput"
        />
      </div>

      <div class="control">
        <div class="select">
          <select :value="value.level" @change="onChange">
            <option
              v-for="(headerLevel, index) in headerLevels"
              :key="index"
              :value="headerLevel"
            >
              H{{ headerLevel }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import _debounce from 'lodash/debounce';

export default {
  name: 'FieldHeader',

  props: {
    label: {
      type: String,
      required: true,
    },

    value: {
      type: Object,
      default: () => ({
        level: 2,
        text: '',
      }),
    },
  },

  data() {
    return {
      headerLevels: [1, 2, 3, 4, 5],
      fieldId: null,
    };
  },

  mounted() {
    this.headerData = this.value || this.headerData;
    this.fieldId = uuidv4();
  },

  methods: {
    onChange(evt) {
      this.$emit('update', {
        text: this.value.text,
        level: evt.target.value,
      });
    },

    onInput: _debounce(function (evt) {
      this.$emit('update', {
        text: evt.target.value,
        level: this.value.level,
      });
    }, 250),
  },
};
</script>
