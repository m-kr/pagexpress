<template>
  <div class="field-list">
    <label :for="label" class="label">{{ label }}</label>
    <div class="field is-fullwidth has-addons">
      <div class="control">
        <input
          v-if="!options.length"
          :id="label"
          v-model="newItem"
          class="input"
          type="text"
          @keyup.enter="addItem"
        />
        <div v-else class="select">
          <select :id="label" v-model="newItem">
            <option value="">-- Chose value --</option>
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
      <div class="control">
        <button class="button is-info" @click="addItem">
          <span>Add</span>
          <span class="icon">
            <fa icon="plus" />
          </span>
        </button>
      </div>
    </div>
    <ul>
      <li v-for="(value, index) of values" :key="index">
        <button
          class="button is-light is-danger is-small"
          @click="removeItem(value)"
        >
          <span class="icon is-small">
            <fa :icon="['fas', 'times']" />
          </span>
        </button>
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
    options: {
      type: Array,
      default: () => [],
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
      this.$emit('add', this.newItem);
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
