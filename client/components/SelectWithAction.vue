<template>
  <div class="field-list">
    <div class="field has-addons">
      <div class="control is-expanded">
        <div class="select is-fullwidth">
          <select v-model="picketItem" name="country">
            <option
              v-for="option in options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="control">
        <button class="button is-primary" @click="triggerAction">
          Add component +
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectWithAction',
  props: {
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      default: () => [],
    },
    action: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      picketItem: '',
    };
  },

  mounted() {
    this.picketItem = this.options[0].value;
  },

  methods: {
    triggerAction() {
      this.action(this.picketItem);
    },
  },
};
</script>
