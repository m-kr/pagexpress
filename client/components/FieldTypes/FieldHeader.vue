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
          <select
            :value="value.level"
            @change="evt => onChange('level', evt.target.value)"
          >
            <option
              v-for="(headerLevel, index) in headerLevels"
              :key="`header-level-${index}`"
              :value="headerLevel"
            >
              Level H{{ headerLevel }}
            </option>
          </select>
        </div>
      </div>

      <div class="control">
        <div class="select">
          <select
            :value="value.sizeStyle"
            @change="evt => onChange('sizeStyle', evt.target.value)"
          >
            <option
              value=""
              :select="!(value.sizeStyle && value.sizeStyle.length)"
            >
              Default
            </option>
            <option
              v-for="(sizeStyle, index) in headerLevels"
              :key="`size-${index}`"
              :value="sizeStyle"
            >
              Size H{{ sizeStyle }}
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
        text: '',
        level: '2',
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
    this.fieldId = uuidv4();
  },

  methods: {
    onChange(fieldName, value) {
      this.$emit('update', {
        ...this.value,
        [fieldName]: value.length ? value : null,
      });
    },

    onInput: _debounce(function (evt) {
      this.$emit('update', {
        ...this.value,
        text: evt.target.value,
      });
    }, 250),
  },
};
</script>
