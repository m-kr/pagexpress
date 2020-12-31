<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <a
      :class="currentPage === totalPages ? 'is-disabled' : ''"
      class="pagination-next"
      @click.prevent="changePage(currentPage + 1)"
    >
      Next
    </a>
    <a
      class="pagination-previous"
      :class="currentPage !== 1 ? '' : 'is-disabled'"
      title="This is the first page"
      @click.prevent="changePage(currentPage - 1)"
    >
      Prev
    </a>
    <ul class="pagination-list">
      <li>Page {{ currentPage }} of {{ totalPages }}</li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',

  props: {
    currentPage: {
      type: Number,
      default: 1,
    },

    totalPages: {
      type: Number,
      default: 1,
    },

    changePage: {
      type: Function,
      required: true,
    },
  },
};
</script>
