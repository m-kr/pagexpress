<template>
  <div class="draggable-form">
    <slot name="form" />
    <div class="draggable-form__actions buttons">
      <slot name="actions" />
    </div>
    <span class="draggable-form__grab-handler">
      <fa icon="grip-vertical" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'DraggableForm',
};
</script>

<style lang="postcss">
.draggable-form {
  position: relative;
  padding: var(--spacing-25) var(--spacing) var(--spacing-05);
  background-color: var(--gray-dark);
  counter-increment: row-number;

  &:not(:first-of-type) {
    margin-top: var(--spacing);
  }

  &::before {
    position: absolute;
    top: var(--spacing-05);
    left: var(--spacing-05);
    font-size: var(--font-small);
    font-weight: 700;
    color: var(--gray-darken);
    content: '#' counter(row-number);
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
