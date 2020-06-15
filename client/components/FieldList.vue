<template>
  <div class="field-list">
    <label :for="label" class="label">{{ label }}</label>
    <div class="field is-fullwidth has-addons">
      <div class="control">
        <input :id="label" v-model="newItem" class="input" type="text" />
      </div>
      <div class="control">
        <a class="button is-info" @click.prevent="addItem">
          Add +
        </a>
      </div>
    </div>
    <ul>
      <li v-for="(value, index) of values" :key="index">
        <a
          class="button is-light is-danger is-small"
          @click.prevent="removeItem(value)"
        >
          &times;
        </a>
        {{ value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FieldList',
  props: {
    label: {
      type: String,
      required: true,
    },
    values: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      newItem: '',
    };
  },
  methods: {
    addItem() {
      this.$emit('update', [...this.values, this.newItem]);
      this.newItem = '';
    },
    removeItem(removedValue) {
      this.$emit(
        'update',
        this.values.filter(val => val !== removedValue)
      );
    },
  },
};
</script>

<style scoped>
li {
  margin-bottom: 0.5em;
}
</style>
