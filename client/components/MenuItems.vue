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
        <div v-if="!editingItems.includes(item.id)" class="menu-item__info">
          <span class="menu-item__name">{{ item.label }}</span>
          <span class="menu-item__url">{{ item.url }}</span>
        </div>
        <div v-if="editingItems.includes(item.id)" class="menu-item__edit-form">
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label :for="`menu-item-label-${item.id}`" class="label">
                Label
              </label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input
                    id="`menu-item-label-${item.id}`"
                    type="text"
                    class="input is-small"
                    :value="item.label"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label :for="`menu-item-url-${item.id}`" class="label">URL</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input
                    id="`menu-item-url-${item.id}`"
                    type="text"
                    class="input is-small"
                    :value="item.url"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="buttons is-right">
              <button class="button is-small is-success">Save</button>
              <button
                class="button is-small is-black"
                @click="switchEditState(item.id)"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div class="menu-item__action buttons">
          <button
            v-if="item.children && item.children.length"
            class="button is-small"
            @click="switchCollapsedState(item.id)"
          >
            <span class="icon is-small">
              <fa
                v-if="!collapsedItems.includes(item.id)"
                :icon="['fa', 'minus']"
              />
              <fa v-else :icon="['fa', 'plus']" />
            </span>
          </button>
          <button
            class="button is-info is-small"
            @click="switchEditState(item.id)"
          >
            <span class="icon is-small">
              <fa :icon="['fa', 'edit']" />
            </span>
          </button>
          <button class="button is-danger is-small" @click="removeItem(item)">
            <span class="icon is-small">
              <fa :icon="['fa', 'times']" />
            </span>
          </button>
        </div>
      </div>

      <MenuItems
        v-if="!collapsedItems.includes(item.id)"
        :chunk="item.children"
        :reorder="reorder"
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

    reorder: {
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
      editingItems: [],
      collapsedItems: [],
    };
  },

  methods: {
    onDrop(dragResult) {
      this.reorder(dragResult, this.parentItemId);
    },

    getItemPayload(index) {
      return this.chunk[index];
    },

    switchEditState(itemId) {
      if (!this.editingItems.includes(itemId)) {
        this.editingItems.push(itemId);
      } else {
        this.editingItems = this.editingItems.filter(
          editingItem => editingItem !== itemId
        );
      }
    },

    switchCollapsedState(itemId) {
      if (!this.collapsedItems.includes(itemId)) {
        this.collapsedItems.push(itemId);
      } else {
        this.collapsedItems = this.collapsedItems.filter(
          collapsedItem => collapsedItem !== itemId
        );
      }
    },

    removeItem(item) {
      if (confirm('Please confirm removing menu item')) {
        console.log(`${item.label} has been removed`);
      }
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
    align-items: flex-start;
  }

  &__edit-form {
    flex-grow: 1;
    padding-right: var(--spacing-2);
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
