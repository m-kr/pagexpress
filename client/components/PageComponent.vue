<template>
  <div
    v-if="componentPattern"
    :class="hasSlot ? 'card-action-below' : ''"
    class="card__inner"
  >
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
      <ComponentSelector
        :component-patterns="componentPatterns ? componentPatterns : []"
        label="Inner component +"
        color="success"
        size="small"
        :select-action="patternId => addComponent(patternId, component._id)"
      />
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
          :data="
            component.data ? component.data[singleFieldset.name] : undefined
          "
          :on-update-data="value => updateData(singleFieldset.name, value)"
        />
      </div>

      <div v-if="childComponents.length" class="inner-components">
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
              :add-component="addComponent"
              :update-component="updateComponent"
              :remove-component="removeComponent"
              :get-child-components="getChildComponents"
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
    </div>
    <div v-if="hasSlot" class="card-action-below__wrapper">
      <slot />
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd';
import ComponentSelector from './ComponentSelector';
import PageComponentData from './PageComponentData';
import PageComponentDataset from './PageComponentDataset';

export default {
  name: 'PageComponent',

  components: {
    ComponentSelector,
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

    component: {
      type: Object,
      required: true,
    },

    addComponent: {
      type: Function,
      required: true,
    },

    updateComponent: {
      type: Function,
      required: true,
    },

    removeComponent: {
      type: Function,
      required: true,
    },

    getChildComponents: {
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

    childComponents() {
      return this.getChildComponents(this.component._id);
    },

    hasSlot() {
      return !!this.$slots.default;
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

  .component-selector__container,
  .button {
    align-self: center;
    margin-right: var(--spacing);
  }
}

.card-content {
  padding: var(--spacing) var(--spacing-05) var(--spacing-05);

  & > * {
    &:not(:last-of-type) {
      margin-bottom: var(--spacing-2);
    }
  }
}

.card-action-below {
  position: relative;
  margin-bottom: var(--spacing-4);

  &__wrapper {
    position: absolute;
    left: 50%;
    margin-left: calc(-1 * var(--spacing-3));
    bottom: calc(-1 * var(--spacing-3));
  }
}

.inner-components {
  .card {
    box-shadow: none;
    border: 1px solid var(--border-color);
  }
}
</style>
