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
          <button class="button is-info is-inverted is-outlined is-small">
            Edit
          </button>
          <button class="button is-primary is-light is-small">Duplicate</button>
          <button class="button is-info is-light is-small">Copy</button>
          <button class="button is-info is-light is-small">Move</button>
          <button class="button is-info is-light is-small">Paste</button>
          <button class="button is-danger is-light is-small">Remove</button>
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
          display: inline-block;
        }
      }
    }
  }

  &__action {
    &--add-child {
      display: none;
    }

    &--add-first-child {
      position: absolute;
      left: 0.1em;
      top: 50%;
      transform: translate(calc(var(--spacing) * -1), -50%);
    }

    &--add-after {
      position: absolute;
      left: 0;
      top: 50%;
      margin-left: var(--spacing-05);
      transform: translate(calc(var(--spacing-4) * -1), -50%);
    }

    &-btn {
      height: var(--spacing-2);
      width: var(--spacing-2);
      padding: 0;
      line-height: 0;
      border: 0;
      background-color: var(--border-color);
      border: 1px solid var(--border-color);
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
  }

  &__title {
    font-weight: 600;
    font-size: var(--font-small);
  }
}
</style>
