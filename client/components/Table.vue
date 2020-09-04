<template>
  <div class="table-container">
    <table class="table is-fullwidth is-striped">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rowData, rowId) in data" :key="rowId">
          <td v-for="(cellContent, index) in rowData" :key="index">
            {{ cellContent }}
          </td>
          <td>
            <div class="buttons are-small">
              <span
                v-for="(action, index) in actions"
                :key="index"
                class="action-button-wrapper"
              >
                <nuxt-link
                  v-if="action.type === 'link'"
                  :class="`is-${action.styleClass}`"
                  class="button is-light"
                  :to="action.action(rowId)"
                  >{{ action.label }}</nuxt-link
                >
                <button
                  v-if="action.type === 'button'"
                  :class="`is-${action.styleClass}`"
                  class="button is-danger is-light"
                  @click="action.action(rowId)"
                >
                  {{ action.label }}
                </button>
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    headers: {
      type: Array,
      required: true,
    },
    actions: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style>
.action-button-wrapper {
  &:not(:last-of-type) {
    margin-right: 0.5rem;
  }
}
</style>
