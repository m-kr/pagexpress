<template>
  <div class="select-with-action">
    <div class="field is-grouped">
      <div class="control is-expanded">
        <div class="select is-fullwidth">
          <select v-model="picketItem" name="country">
            <option value="">-- {{ placeholder }} --</option>
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
        <button
          :disabled="!picketItem.length"
          class="button is-link"
          @click="triggerAction"
        >
          {{ buttonLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectWithAction',
  props: {
    placeholder: {
      type: String,
      required: true,
    },
    buttonLabel: {
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

  methods: {
    triggerAction() {
      this.action(this.picketItem);
      this.picketItem = '';
    },
  },
};
</script>

<style lang="postcss" scoped>
.select-with-action {
  display: flex;
}
</style>
