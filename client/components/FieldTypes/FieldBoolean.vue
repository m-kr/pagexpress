<template>
  <div class="field is-fullwidth">
    <label class="checkbox">
      <input
        :checked="value === true"
        type="checkbox"
        @input="onChange($event.target.checked)"
      />
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'FieldBoolean',
  props: {
    label: {
      type: String,
      required: true,
    },

    value: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onChange(value) {
      this.$emit('update', value);
    },
  },
};
</script>
