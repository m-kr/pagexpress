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
              <input class="input" type="text" placeholder="Find title" />
            </p>
            <p class="control">
              <button class="button">
                Search
              </button>
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
    <Table :headers="headers" :data="pagesList" :actions="pageActions" />
    <nav class="pagination" role="navigation" aria-label="pagination">
      <a class="pagination-previous" title="This is the first page">Previous</a>
      <a class="pagination-next">Next page</a>
      <ul class="pagination-list">
        <li>
          <a
            class="pagination-link is-current"
            aria-label="Page 1"
            aria-current="page"
            >1</a
          >
        </li>
        <li>
          <a class="pagination-link" aria-label="Goto page 2">2</a>
        </li>
        <li>
          <a class="pagination-link" aria-label="Goto page 3">3</a>
        </li>
      </ul>
    </nav>
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
    }),
  },
};
</script>
