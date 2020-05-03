<template>
  <section class="section">
    <div class="container">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><a href="#">Home</a></li>
          <li class="is-active"><a href="#" aria-current="page">Pages</a></li>
        </ul>
      </nav>
      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <nuxt-link class="button is-success is-small" to="pages/add">
            <strong>+ Add page</strong>
          </nuxt-link>
        </div>
      </div>
      <Table :headers="headers" :data="pagesList" :actions="pageActions" />
      <nav class="pagination" role="navigation" aria-label="pagination">
        <a class="pagination-previous" title="This is the first page"
          >Previous</a
        >
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
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Table from '~/components/Table';

export default {
  components: {
    Table,
  },

  data() {
    return {
      errorMessage: [],
      headers: ['Title', 'Description', 'Url'],
    };
  },

  computed: {
    ...mapState({
      pagesList: state => {
        const pagesListData = {};
        state.pages.pagesList.map(({ _id, title, description, url }) => {
          pagesListData[_id] = [title, description, url];
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
          action: pageId => `pages/${pageId}`,
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
