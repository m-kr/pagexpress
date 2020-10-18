<template>
  <Container
    class="menu-items"
    group-name="menu-items"
    :get-child-payload="getChildPayload"
    @drop="onDrop"
  >
    <Draggable v-for="item in chunk" :key="item.id" class="menu-item">
      <div class="menu-item__inner">
        <span class="menu-item__name">{{ item.label }}</span>
        <span class="menu-item__url">{{ item.url }}</span>
      </div>

      <div v-if="item.children" class="menu-item__children">
        <MenuItems
          :chunk="item.children"
          :update="update"
          :parent-item-id="item.id"
        />
      </div>
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

  methods: {
    onDrop(dragResult) {
      this.update(dragResult, this.parentItemId);
    },

    getChildPayload(index) {
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
    padding: var(--spacing-05) var(--spacing);
    background-color: var(--gray-dark);
  }

  &:not(:last-of-type) {
    margin-bottom: var(--spacing-05);
  }
}
</style>
