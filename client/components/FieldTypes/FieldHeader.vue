<template>
  <div class="field is-fullwidth">
    <label :for="fieldId" class="label">{{ label }}</label>
    <div class="field-body is-expanded">
      <div class="control main-field">
        <input
          :id="fieldId"
          v-model="headerData.text"
          class="input"
          type="text"
          @input="onInput"
        />
      </div>

      <div class="control">
        <div class="select">
          <select
            v-model="headerData.level"
            @change="evt => onChange('level', evt.target.value)"
          >
            <option
              v-for="(headerLevel, index) in headerLevels"
              :key="`header-level-${fieldId}-${index}`"
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
            v-model="headerData.sizeStyle"
            @change="evt => onChange('sizeStyle', evt.target.value)"
          >
            <option
              value=""
              :select="!(value.sizeStyle && value.sizeStyle.length)"
            >
              Default
            </option>
            <option
              v-for="(headerLevel, sizeStyle) in sizesLevels"
              :key="`size-${fieldId}-${sizeStyle}`"
              :value="sizeStyle"
            >
              Size H{{ headerLevel }}: {{ sizeStyle }}
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
        level: '2',
        text: '',
      }),
    },
  },

  data() {
    return {
      headerLevels: [1, 2, 3, 4, 5],
      sizesLevels: {
        1: 1,
        2: 2,
        title: 2,
        3: 3,
        4: 4,
        5: 5,
      },
      fieldId: null,
      headerData: {
        text: '',
        level: '2',
      },
    };
  },

  mounted() {
    this.fieldId = uuidv4();
    this.headerData = { ...this.value };
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

<style lang="postcss" scoped>
.main-field {
  width: 100%;
}
</style>
