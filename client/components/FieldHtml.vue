<template>
  <div class="field is-fullwidth">
    <label :for="label" class="label">{{ label }}</label>
    <div class="control">
      <textarea
        :id="label"
        :value="value"
        class="textarea"
        :placeholder="placeholder"
        @input="onInput($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldHtml',
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
