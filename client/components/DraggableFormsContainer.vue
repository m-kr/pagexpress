<template>
  <Container
    class="draggable-forms-container"
    drag-class="draggable-form__ghost"
    drop-class="draggable-form__ghost--drop"
    :group-name="`draggable-form-${getRandomId}`"
    drag-handle-selector=".draggable-form__grab-handler"
    :get-child-payload="getItemPayload"
    :drop-placeholder="dropPlaceholderOptions"
    @drop="onDrop"
  >
    <slot />
    <div class="draggable-forms-container__actions">
      <button class="button is-small is-success" @click="addItem">
        Add +
      </button>
    </div>
  </Container>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { Container } from 'vue-smooth-dnd';

export default {
  name: 'DraggableFormsContainer',

  components: {
    Container,
  },

  props: {
    getItemPayload: {
      type: Function,
      default: () => {},
    },

    addItem: {
      type: Function,
      default: () => {},
    },

    onDrop: {
      type: Function,
      required: true,
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
    getRandomId() {
      return uuidv4();
    },
  },
};
</script>

<style lang="postcss">
.draggable-forms-container {
  &__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing);
  }
}

.smooth-dnd-container {
  &.vertical {
    & > .smooth-dnd-draggable-wrapper {
      &.columns {
        display: flex;
        overflow: visible;
      }
    }
  }
}
</style>
