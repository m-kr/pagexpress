<template>
  <div
    class="draggable-form__outer"
    :class="type ? `draggable-form__outer--${type}` : ''"
  >
    <div class="draggable-form">
      <slot name="form" />
      <span class="draggable-form__grab-handler">
        <fa icon="grip-vertical" />
      </span>
    </div>
    <div class="draggable-form__actions buttons">
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DraggableForm',

  props: {
    type: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="postcss">
.draggable-form {
  &__outer {
    position: relative;
    padding: var(--spacing-25) var(--spacing) var(--spacing-05);
    background-color: var(--gray-dark);
    counter-increment: row-number;

    &--nested {
      background-color: var(--white);
    }

    &:not(.draggable-form__outer--nested) {
      &::before {
        position: absolute;
        top: var(--spacing-05);
        left: var(--spacing-05);
        font-size: var(--font-small);
        font-weight: 700;
        color: var(--gray-darken);
        content: '#' counter(row-number);
      }
    }

    &:not(:first-of-type) {
      margin-top: var(--spacing);
    }
  }

  &__actions {
    justify-content: flex-end;
  }

  &__grab-handler {
    position: absolute;
    top: var(--spacing-025);
    right: var(--spacing-025);
    padding: var(--spacing-025) var(--spacing-05);
    color: var(--gray-darken);
    cursor: move;

    &:hover {
      color: var(--black);
    }
  }

  &__ghost {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--gray-dark);
    border: 2px solid var(--gray-darken);
    z-index: 3;

    & * {
      visibility: hidden;
      opacity: 0;
    }
  }
}
</style>
