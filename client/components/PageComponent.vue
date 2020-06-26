<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <span>{{ componentPattern.name }}</span>
        <small>{{ componentPattern.description }}</small>
      </p>
      <a href="#" class="card-header-icon" aria-label="more options">
        <span class="icon">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </a>
    </header>
    <div class="card-content">
      <PageComponentData
        v-if="componentPattern"
        :fields="componentPattern.fields"
        :field-types="fieldTypes"
        :data="data"
        :on-update-data="updateData"
      />
      <slot></slot>
    </div>
  </div>
</template>

<script>
import PageComponentData from './PageComponentData';

export default {
  name: 'PageComponent',

  components: {
    PageComponentData,
  },

  props: {
    parentComponentId: {
      type: String,
      default: null,
    },
    componentPattern: {
      type: Object,
      required: true,
    },
    fieldTypes: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
    order: {
      type: Number,
      default: 0,
    },
    components: {
      type: Array,
      default: () => [],
    },
    attributes: {
      type: Object,
      default: () => {},
    },
    updateComponent: {
      type: Function,
      required: true,
    },
  },

  methods: {
    updateData(fieldName, value) {
      this.updateComponent({
        data: {
          ...this.data,
          parentComponentId: this.parentComponentId,
          [fieldName]: value,
        },
      });
    },
  },
};
</script>

<style scoped>
.card-header-title {
  flex-direction: column;
  align-items: flex-start;

  & > * {
    display: block;
  }
}
</style>
