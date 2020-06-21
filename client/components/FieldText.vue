<template>
  <div class="field is-fullwidth">
    <label :for="label" class="label">{{ label }}</label>
    <div class="control">
      <input
        :id="label"
        :value="value"
        class="input"
        type="text"
        :placeholder="placeholder"
        @input="onInput($event.target.value)"
      />
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
    placeholder: {
      type: String,
      default: '',
    },
  },
  methods: {
    onInput(value) {
      this.$emit('update', value);
    },
  },
};
</script>
