<template>
  <div
    class="tree-node__root"
    :class="clipboardState ? `tree-node__root--${clipboardState}` : ''"
  >
    <div v-if="firstRoot" class="tree-node__origin-node">
      <button
        class="tree-node__action-btn tree-node__action--add-first-child"
        :title="emptyClipboard ? 'Add' : 'Paste'"
        @click="emptyClipboard ? addBefore() : pasteBefore()"
      >
        <fa :icon="emptyClipboard ? ['fa', 'plus'] : ['fa', 'paste']" />
      </button>
    </div>
    <div
      v-if="add && clone && copy"
      :class="childComponents.length ? 'tree-node--with-branch' : ''"
      class="tree-node"
    >
      <div class="tree-node__info">
        <div class="tree-node__title">{{ componentPattern.name }}</div>
      </div>
      <div class="tree-node__actions">
        <div class="buttons">
          <button
            class="button is-info is-light is-small"
            title="Edit"
            :disabled="clipboardState"
            @click="edit(component)"
          >
            <fa :icon="['fa', 'edit']" />
          </button>
          <button
            class="button is-primary is-light is-small"
            title="Clone"
            :disabled="clipboardState"
            @click="clone(component)"
          >
            <fa :icon="['fa', 'clone']" />
          </button>
          <button
            :disabled="!emptyClipboard"
            class="button is-info is-light is-small"
            title="Copy"
            @click="copy(component)"
          >
            <fa :icon="['fa', 'copy']" />
          </button>
          <button
            :disabled="!emptyClipboard"
            class="button is-info is-light is-small"
            title="Cut"
            @click="cut(component)"
          >
            <fa :icon="['fa', 'cut']" />
          </button>
          <button
            class="button is-danger is-light is-small"
            title="Remove"
            :disabled="clipboardState"
            @click="remove(component._id)"
          >
            <fa :icon="['fa', 'trash-alt']" />
          </button>
        </div>
      </div>
    </div>
    <div
      class="tree-node__footer"
      :class="!childComponents.length ? 'tree-node__footer--no-children' : ''"
    >
      <button
        class="tree-node__action-btn tree-node__action--add-child"
        :title="emptyClipboard ? 'Add' : 'Paste'"
        :disabled="clipboardState"
        @click="emptyClipboard ? addNext() : pasteNext()"
      >
        <fa :icon="emptyClipboard ? ['fa', 'plus'] : ['fa', 'paste']" />
      </button>

      <button
        class="tree-node__action-btn tree-node__action--add-first-child"
        :title="emptyClipboard ? 'Add' : 'Paste'"
        :disabled="clipboardState"
        @click="emptyClipboard ? addFirstChild() : pasteAsFirstChild()"
      >
        <fa :icon="emptyClipboard ? ['fa', 'plus'] : ['fa', 'paste']" />
      </button>

      <button
        class="tree-node__action-btn tree-node__action--add-after"
        :title="emptyClipboard ? 'Add' : 'Paste'"
        :disabled="clipboardState"
        @click="emptyClipboard ? addAfterSelf() : pasteAfterSelf()"
      >
        <fa :icon="emptyClipboard ? ['fa', 'plus'] : ['fa', 'paste']" />
      </button>
    </div>
    <div v-if="childComponents.length" class="tree-node__branch">
      <ComponentTreeNode
        v-for="childComponent in childComponents"
        :key="childComponent._id"
        :component="childComponent"
        :parent-component="childComponent"
        :component-patterns="componentPatterns"
        :in-clipboard="inClipboard"
        :get-child-components="getChildComponents"
        :empty-clipboard="emptyClipboard"
        :search-phrase="searchPhrase"
        :add="add"
        :edit="edit"
        :remove="remove"
        :clone="clone"
        :copy="copy"
        :cut="cut"
        :paste="paste"
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

    inClipboard: {
      type: Function,
      required: true,
    },

    firstRoot: {
      type: Boolean,
      default: false,
    },

    emptyClipboard: {
      type: Boolean,
      default: true,
    },

    searchPhrase: {
      type: String,
      default: '',
    },

    add: {
      type: Function,
      required: true,
    },

    edit: {
      type: Function,
      required: true,
    },

    clone: {
      type: Function,
      required: true,
    },

    copy: {
      type: Function,
      required: true,
    },

    cut: {
      type: Function,
      required: true,
    },

    paste: {
      type: Function,
      required: true,
    },

    remove: {
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

    clipboardState() {
      const clipboardState = this.inClipboard(this.component._id);

      return clipboardState || null;
    },
  },

  methods: {
    addFirstChild() {
      this.add({
        parentComponentId: this.component._id,
        nextComponentId: this.childComponents[0]._id,
      });
    },

    addAfterSelf() {
      this.add({
        parentComponentId: this.component.parentComponentId,
        previousComponentId: this.component._id,
      });
    },

    addBefore() {
      this.add({
        nextComponentId: this.component._id,
      });
    },

    addNext() {
      this.add({
        parentComponentId: this.component._id,
      });
    },

    pasteAsFirstChild() {
      this.paste({
        parentComponentId: this.component._id,
        nextComponentId: this.childComponents[0]._id,
      });
    },

    pasteAfterSelf() {
      this.paste({
        parentComponentId: this.component.parentComponentId,
        previousComponentId: this.component._id,
      });
    },

    pasteBefore() {
      this.paste({
        nextComponentId: this.component._id,
      });
    },

    pasteNext() {
      this.paste({
        parentComponentId: this.component._id,
      });
    },

    update(componentId, componentData) {
      this.$emit('update', {
        componentId,
        componentData,
      });
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

  &__origin-node {
    position: relative;
    overflow: visible;

    .tree-node__action--add-first-child {
      margin-left: 0;
      margin-bottom: 0.5em;
    }
  }

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
    }

    &--cut {
      .tree-node__info {
        opacity: 0.5;
      }
    }

    &--copy {
      background-color: rgba(50, 152, 220, 0.1);

      .tree-node__root--copy {
        background-color: transparent;
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
