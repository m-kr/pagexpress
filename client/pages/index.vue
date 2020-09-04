<template>
  <div class="app-view">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><a href="#">Home</a></li>
        <li class="is-active"><a href="#" aria-current="page">Pages</a></li>
      </ul>
    </nav>
    <nav class="level">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <input
                v-model="searchKeyword"
                class="input"
                type="search"
                placeholder="Search"
                @input="search"
              />
            </p>
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="level-right">
        <p class="level-item">
          <nuxt-link to="/pages/add" class="button is-success">New</nuxt-link>
        </p>
      </div>
    </nav>
    <div v-if="Object.keys(pagesList).length" class="pages-list__wrapper">
      <Table :headers="headers" :data="pagesList" :actions="pageActions" />
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
    </div>
    <article
      v-if="!Object.keys(pagesList).length && searchKeyword.length"
      class="message"
    >
      <div class="message-header">
        <p>Searching results</p>
      </div>
      <div class="message-body">
        <p>There is no page for searching phrase</p>
      </div>
    </article>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Table from '~/components/Table';

export default {
  components: {
    Table,
  },

  asyncData({ store }) {
    store.dispatch('pages/loadPages');
  },

  data() {
    return {
      errorMessage: [],
      headers: ['Name', 'Url'],
      timeout: null,
      searchKeyword: '',
    };
  },

  computed: {
    ...mapState({
      pagesList: state => {
        const pagesListData = {};
        state.pages.pagesList.map(({ _id, name, url }) => {
          pagesListData[_id] = [name, url];
        });

        return pagesListData;
      },
      currentPage: state => state.pages.currentPage,
      totalPages: state => state.pages.totalPages,
    }),

    pageActions() {
      return {
        edit: {
          type: 'link',
          styleClass: 'info',
          label: 'Edit',
          action: pageId => `pages/${pageId}/edit`,
        },
        delete: {
          type: 'button',
          styleClass: 'danger',
          label: 'Delete',
          action: pageId => this.removePage(pageId),
        },
      };
    },
  },

  mounted() {
    this.loadPages();
  },

  methods: {
    ...mapActions({
      loadPages: 'pages/loadPages',
      removePage: 'pages/removePage',
      changePage: 'pages/changePage',
    }),

    search(evt) {
      if (this.timeout) clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.$store.dispatch('pages/searchPage', evt.target.value);
      }, 200);
    },
  },
};
</script>

<style scoped lang="postcss">
.pagination {
  .is-disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
