<template>
  <div v-if="componentPattern" class="card__inner">
    <header class="card-header">
      <span
        :class="isRootComponent ? 'root' : 'inner'"
        class="card-header__grab-handler"
      >
        <fa icon="grip-vertical" />
      </span>
      <p class="card-header-title">
        <span>{{ componentPattern.label }}</span>
        <small>{{ componentPattern.description }}</small>
      </p>
      <button
        class="button is-small"
        @click="toggleCollapsedState(component._id)"
      >
        <span class="icon is-small">
          <fa v-if="!collapsed" :icon="['fa', 'minus']" />
          <fa v-if="collapsed" :icon="['fa', 'plus']" />
        </span>
      </button>
      <button class="button is-danger is-small" @click="selfDestruction">
        <span class="icon is-small">
          <fa :icon="['fa', 'times']" />
        </span>
      </button>
    </header>
    <div v-if="!collapsed" class="card-content">
      <div v-if="componentPattern.fields" class="fields-container">
        <PageComponentData
          :fields="componentPattern.fields"
          :field-types="fieldTypes"
          :data="component.data"
          :on-update-data="updateData"
        />
      </div>

      <div
        v-if="componentPattern && componentPattern.fieldset"
        class="fieldset-container"
      >
        <PageComponentDataset
          v-for="singleFieldset in componentPattern.fieldset"
          :key="singleFieldset._id"
          :fields="singleFieldset.fields"
          :field-types="fieldTypes"
          :data="
            component.data ? component.data[singleFieldset.name] : undefined
          "
          :on-update-data="value => updateData(singleFieldset.name, value)"
        />
      </div>

      <div v-if="childComponents.length" class="inner-components">
        <h4 class="title is-4">Inner components</h4>

        <Container
          v-if="componentPatterns && componentPatterns.length"
          class="components-wrapper"
          drag-handle-selector=".card-header__grab-handler.inner"
          :drop-placeholder="dropPlaceholderOptions"
          @drop="onDrop"
        >
          <Draggable
            v-for="childComponent in childComponents"
            :key="childComponent._id"
            class="card"
          >
            <PageComponent
              :component="childComponent"
              :component-patterns="componentPatterns"
              :field-types="fieldTypes"
              :update-component="updateComponent"
              :remove-component="removeComponent"
              :reorder="reorder"
              :drop-placeholder-options="dropPlaceholderOptions"
              :collapsed="collapsedChildren.includes(childComponent._id)"
              :is-root-component="false"
              :toggle-collapsed-state="
                toggleChildrenCollapseState.bind(childComponent._id)
              "
            />
          </Draggable>
        </Container>
      </div>
      <div class="card-footer">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd';
import PageComponentData from './PageComponentData';
import PageComponentDataset from './PageComponentDataset';

export default {
  name: 'PageComponent',

  components: {
    Container,
    Draggable,
    PageComponentData,
    PageComponentDataset,
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

    removeComponent: {
      type: Function,
      required: true,
    },

    toggleCollapsedState: {
      type: Function,
      default: () => {},
    },

    collapsed: {
      type: Boolean,
      default: false,
    },

    reorder: {
      type: Function,
      required: true,
    },

    dropPlaceholderOptions: {
      type: Object,
      default: () => {},
    },

    isRootComponent: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      collapsedChildren: [],
    };
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

    onDrop(dragResults) {
      let addedItemId = null;
      let removedItemId = null;

      if (
        this.childComponents &&
        this.childComponents[dragResults.addedIndex]
      ) {
        addedItemId = this.childComponents[dragResults.addedIndex]._id;
      }

      if (
        this.childComponents &&
        this.childComponents[dragResults.removedIndex]
      ) {
        removedItemId = this.childComponents[dragResults.removedIndex]._id;
      }

      this.reorder({ addedItemId, removedItemId });
    },

    getComponentPattern(patternId) {
      return this.componentPatterns.find(pattern => pattern._id === patternId);
    },

    selfDestruction() {
      this.removeComponent(this.component._id);
    },

    toggleChildrenCollapseState(targetComponentId) {
      if (this.collapsedChildren.includes(targetComponentId)) {
        this.collapsedChildren = this.collapsedChildren.filter(
          componentId => componentId !== targetComponentId
        );
      } else {
        this.collapsedChildren.push(targetComponentId);
      }
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

  small {
    font-weight: var(--font-weight-normal);
  }
}

.card-header {
  &__grab-handler {
    display: flex;
    align-items: center;
    padding: 0 var(--spacing);
    opacity: 0.4;
    transition: 0.2s ease-in-out;
    cursor: move;

    &:hover {
      opacity: 1;
    }
  }

  &-title {
    padding-left: 0;
  }

  .button {
    align-self: center;
    margin-right: var(--spacing);
  }
}

.card-content {
  & > * {
    &:not(:last-of-type) {
      margin-bottom: var(--spacing-2);
    }
  }
}

.card-footer {
  flex-direction: row-reverse;
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
