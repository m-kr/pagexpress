<template>
  <div class="field is-fullwidth">
    <label :for="label" class="label">{{ label }}</label>
    <div class="control">
      <input
        v-if="!options.length"
        :id="label"
        :value="value"
        class="input"
        type="text"
        :placeholder="placeholder"
        @input="onChange($event.target.value)"
      />

      <div v-if="options.length" class="select">
        <select
          :id="label"
          :value="value"
          @change="onChange($event.target.value)"
        >
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
  methods: {
    onChange(value) {
      this.$emit('update', value);
    },
  },
};
</script>
