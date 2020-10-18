<template>
  <Container
    class="menu-items"
    group-name="menu-items"
    drag-class="menu-item__ghost"
    drop-class="menu-item__ghost--drop"
    drag-handle-selector=".menu-items .menu-item__grab-handler"
    :get-child-payload="getItemPayload"
    :drop-placeholder="dropPlaceholderOptions"
    @drop="onDrop"
  >
    <Draggable v-for="item in chunk" :key="item.id" class="menu-item">
      <div class="menu-item__inner">
        <span class="menu-item__grab-handler">
          <fa icon="grip-vertical" />
        </span>
        <div class="menu-item__info">
          <span class="menu-item__name">{{ item.label }}</span>
          <span class="menu-item__url">{{ item.url }}</span>
        </div>
        <div class="menu-item__action buttons">
          <button
            class="button is-small"
            :disabled="!item.children || !item.children.length"
          >
            <span class="icon is-small">
              <fa :icon="['fa', 'minus']" />
            </span>
          </button>
          <button class="button is-info is-small">
            <span class="icon is-small">
              <fa :icon="['fa', 'edit']" />
            </span>
          </button>
          <button class="button is-danger is-small">
            <span class="icon is-small">
              <fa :icon="['fa', 'times']" />
            </span>
          </button>
        </div>
      </div>

      <MenuItems
        :chunk="item.children"
        :update="update"
        :parent-item-id="item.id"
      />
    </Draggable>
  </Container>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd';

export default {
  name: 'MenuItems',

  components: {
    Container,
    Draggable,
  },

  props: {
    chunk: {
      type: Array,
      default: () => [],
    },

    update: {
      type: Function,
      default: () => null,
    },

    parentItemId: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    };
  },

  methods: {
    onDrop(dragResult) {
      this.update(dragResult, this.parentItemId);
    },

    getItemPayload(index) {
      return this.chunk[index];
    },
  },
};
</script>

<style lang="postcss" scoped>
.menu-items {
  .menu-items {
    margin-top: var(--spacing-05);
    margin-left: var(--spacing-2);
  }
}

.menu-item {
  &__inner {
    display: flex;
    padding: var(--spacing-05) var(--spacing) var(--spacing-05) 0;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
  }

  &:not(:last-of-type) {
    margin-bottom: var(--spacing-05);
  }

  &__info {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  &__name {
    margin-bottom: var(--spacing-025);
  }

  &__url {
    color: var(--blue);
    font-size: var(--font-small);
  }

  &__grab-handler {
    display: flex;
    align-items: center;
    padding: var(--spacing);
    margin-right: var(--spacing);
    color: var(--gray-darken);
    background-color: var(--gray);
    border-right: 1px solid var(--border-color);
    cursor: move;
  }

  &__action {
    display: flex;
  }

  &__ghost {
    padding: var(--spacing-05) var(--spacing) var(--spacing-05) 0;
    background-color: var(--gray);
  }
}

.smooth-dnd-container {
  min-height: var(--spacing-025);
}
</style>
