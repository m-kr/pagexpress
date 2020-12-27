<template>
  <div class="panel">
    <p class="panel-heading">{{ title }}</p>
    <div class="panel-block">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Panel',

  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="postcss">
.panel-block {
  flex-direction: column;
}
</style>
