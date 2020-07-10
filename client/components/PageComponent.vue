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
        :data="component.data"
        :on-update-data="updateData"
      />

      <div v-if="childComponents.length" class="inner-components">
        <h2 class="title is-3">Inner components</h2>

        <PageComponent
          v-for="childComponent in childComponents"
          :key="childComponent._id"
          :component="childComponent"
          :component-patterns="componentPatterns"
          :field-types="fieldTypes"
          :update-component="updateComponent"
        />
      </div>
      <slot />
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
    componentPatterns: {
      type: Array,
      required: true,
    },
    fieldTypes: {
      type: Array,
      default: () => [],
    },
    component: {
      type: Object,
      required: true,
    },
    childComponents: {
      type: Array,
      default: () => [],
    },
    updateComponent: {
      type: Function,
      required: true,
    },
  },

  computed: {
    componentPattern() {
      return this.getComponentPattern(this.component.componentPatternId);
    },
  },

  methods: {
    updateData(fieldName, value) {
      this.updateComponent(this.component._id, {
        data: {
          ...this.component.data,
          [fieldName]: value,
        },
      });
    },
    getComponentPattern(patternId) {
      return this.componentPatterns.find(pattern => pattern._id === patternId);
    },
  },
};
</script>

<style lang="postcss" scoped>
.card-header-title {
  flex-direction: column;
  align-items: flex-start;

  & > * {
    display: block;
  }
}

.inner-components {
  margin-top: var(--spacing-2);
  padding: var(--spacing);
  border: 1px solid var(--border-color);
  background-color: var(--gray-dark);

  .card {
    &:not(:last-of-type) {
      margin-bottom: var(--spacing);
    }
  }
}
</style>
