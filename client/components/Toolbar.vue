<template>
  <div class="toolbar">
    <div class="container toolbar__inner">
      <div class="toolbar__left-side">
        <slot name="left" />
      </div>
      <div class="toolbar__middle">
        <slot name="middle" />
      </div>
      <div class="toolbar__right-side">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
};
</script>

<style lang="postcss" scoped>
.toolbar {
  position: sticky;
  top: 0;
  width: 100%;
  margin-top: var(--spacing-05);
  margin-bottom: var(--spacing);
  padding: var(--spacing);
  background-color: var(--black);
  z-index: 999;

  &__inner {
    display: flex;
    justify-content: space-between;
  }

  &__right-side,
  &__middle,
  &__left-side {
    display: flex;

    & > * {
      margin-right: var(--spacing-05);

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__middle {
    flex: 1 0 0;
    padding: 0 var(--spacing-2);
  }
}
</style>
