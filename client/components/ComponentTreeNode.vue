<template>
  <div class="tree-node__root">
    <div
      :class="childComponents.length ? 'tree-node--with-branch' : ''"
      class="tree-node"
    >
      <div class="tree-node__info">
        <div class="tree-node__title">{{ componentPattern.name }}</div>
      </div>
      <div class="tree-node__actions">
        <div class="buttons">
          <button class="button is-info is-light is-small" @click="edit">
            Edit
          </button>
          <button class="button is-primary is-light is-small" @click="clone">
            Duplicate
          </button>
          <button class="button is-info is-light is-small" @click="copy">
            Copy
          </button>
          <button class="button is-info is-light is-small" @move="move">
            Move
          </button>
          <button class="button is-info is-light is-small" @move="paste">
            Paste
          </button>
          <button class="button is-danger is-light is-small" @move="remove">
            Remove
          </button>
        </div>
      </div>
    </div>
    <div
      class="tree-node__footer"
      :class="!childComponents.length ? 'tree-node__footer--no-children' : ''"
    >
      <button class="tree-node__action-btn tree-node__action--add-child">
        <fa :icon="['fa', 'plus']" />
      </button>

      <button class="tree-node__action-btn tree-node__action--add-first-child">
        <fa :icon="['fa', 'plus']" />
      </button>

      <button class="tree-node__action-btn tree-node__action--add-after">
        <fa :icon="['fa', 'plus']" />
      </button>
    </div>
    <div v-if="childComponents.length" class="tree-node__branch">
      <ComponentTreeNode
        v-for="childComponent in childComponents"
        :key="childComponent._id"
        :component="childComponent"
        :parent-component="childComponent"
        :component-patterns="componentPatterns"
        :get-child-components="getChildComponents"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentTreeNode',
  props: {
    componentPatterns: {
      type: Array,
      required: true,
    },

    component: {
      type: Object,
      required: true,
    },

    getChildComponents: {
      type: Function,
      required: true,
    },
  },

  computed: {
    componentPattern() {
      return this.componentPatterns.find(
        pattern => pattern._id === this.component.componentPatternId
      );
    },

    childComponents() {
      return this.getChildComponents(this.component._id);
    },
  },

  methods: {
    addComponent(componentPatternId, parentComponentId, position) {
      console.log('addChild:', componentPatternId, parentComponentId, position);
    },

    remove(componentId) {
      console.log('remove:', componentId);
    },

    clone(componentId) {
      console.log('clone:', componentId);
    },

    edit(componentId) {
      console.log('edit:', componentId);
    },

    move(componentId, position) {
      console.log('move:', componentId, position);
    },

    copy(componentId, position) {
      console.log('copy:', componentId, position);
    },

    paste(componentId, position) {
      console.log('paste:', componentId, position);
    },
  },
};
</script>

<style lang="postcss" scoped>
.tree-node {
  position: relative;
  display: flex;
  margin-left: var(--spacing-2);
  border-left: 0.2em solid var(--border-color);

  &,
  &__footer {
    &::before {
      position: absolute;
      left: 0;
      top: 50%;
      height: 0.2em;
      width: var(--spacing-2);
      margin-left: -0.2em;
      background-color: var(--border-color);
      transform: translate(calc(var(--spacing-2) * -1), -50%);
      content: '';
    }
  }

  &--with-branch {
    padding-bottom: 0;
  }

  &__root {
    position: relative;
    border-left: 0.2em solid var(--border-color);

    &::after,
    &::before {
      display: none;
      position: absolute;
      left: -0.2em;
      height: var(--spacing-15);
      width: 0.2em;
      background-color: var(--white);
      content: '';
    }

    &::before {
      top: 0;
    }

    &::after {
      bottom: 0;
    }

    &:first-of-type {
      &::before {
        /* display: block; */
      }
    }

    &:last-of-type {
      &::after {
        display: block;
      }

      .tree-node__footer {
        &::after {
          height: 50%;
        }
      }
    }
  }

  &__footer {
    position: relative;
    padding: var(--spacing-3) 0 0 var(--spacing-2);
    margin-left: var(--spacing-2);

    &:not(.tree-node__footer--no-children) {
      &::before {
        display: none;
      }
    }

    &::after {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0.2em;
      background-color: var(--border-color);
      content: '';
    }

    &--no-children {
      padding-top: var(--spacing);
      padding-bottom: var(--spacing);

      &::before {
        transform: translateY(-50%);
        margin-left: 0;
      }

      &::after {
        height: 50%;
      }

      & > .tree-node__action {
        &--add-first-child {
          display: none;
        }

        &--add-child {
          display: flex;
        }
      }
    }
  }

  &__action {
    &--add-child {
      display: none;
    }

    &--add-first-child {
      display: flex;
      position: absolute;
      left: 0;
      margin-left: 0.2em;
      top: 50%;
      transform: translate(calc(var(--spacing) * -1), -50%);
    }

    &--add-after {
      display: flex;
      position: absolute;
      left: 0;
      top: 50%;
      margin-left: 0.1em;
      transform: translate(calc(var(--spacing-4) * -1), -50%);
    }

    &-btn {
      justify-content: center;
      align-items: center;
      height: var(--spacing-2);
      width: var(--spacing-2);
      text-align: center;
      font-size: 0.7em;
      line-height: 0;
      background-color: var(--border-color);
      border: 0.2em solid var(--border-color);
      box-shadow: none;
      border-radius: 50%;
      z-index: 2;
      cursor: pointer;

      &:hover {
        background-color: var(--white);
        border-color: var(--green);
        color: var(--green);
      }
    }
  }

  &__branch {
    margin-left: var(--spacing-2);
  }

  &__info {
    flex: 0 0 15em;
    padding: var(--spacing);
    background-color: var(--gray);
  }

  &__actions {
    display: flex;
    align-items: center;
    padding-left: var(--spacing-2);
  }

  &__title {
    font-weight: 600;
    font-size: var(--font-small);
  }
}
</style>
