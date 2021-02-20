<template>
  <div class="app-view">
    <nav class="level">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item list-toolbar">
          <div class="list-toolbar__item">
            <input
              v-model="searchKeyword"
              class="input"
              type="search"
              placeholder="Search"
              @input="search"
            />
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="level-right">
        <p class="level-item">
          <nuxt-link to="/components/add" class="button is-success">
            Add new +
          </nuxt-link>
        </p>
      </div>
    </nav>
    <div v-if="Object.keys(components).length" class="pages-list__wrapper">
      <Table
        :headers="headers"
        :data="components"
        :actions="componentActions"
      />
      <Pagination
        :change-page="changePage"
        :current-page="currentPage"
        :total-pages="totalPages"
      />
    </div>
    <article
      v-if="!Object.keys(components).length && searchKeyword.length"
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
import { Table, Pagination } from '@/components';

export default {
  components: {
    Pagination,
    Table,
  },

  asyncData({ store }) {
    store.dispatch('componentPatterns/fetchComponentPatterns');
  },

  data() {
    return {
      errorMessage: [],
      headers: ['Name', 'Label', 'Description'],
      timeout: null,
      searchKeyword: '',
      sortBy: '',
    };
  },

  computed: {
    ...mapState({
      components: state => {
        const componentsListData = {};
        state.componentPatterns.componentPatterns.map(
          ({ _id, name, label, description }) => {
            componentsListData[_id] = [name, label, description];
          }
        );

        return componentsListData;
      },
      currentPage: state => state.componentPatterns.currentPage,
      totalPages: state => state.componentPatterns.totalPages,
    }),

    componentActions() {
      return {
        edit: {
          type: 'link',
          styleClass: 'info',
          label: 'Edit',
          action: componentId => `components/${componentId}/edit`,
        },
        delete: {
          type: 'button',
          styleClass: 'danger',
          label: 'Delete',
          action: componentId => this.removeComponent(componentId),
        },
      };
    },
  },

  mounted() {
    this.fetchComponents();
    this.setBreadcrumbsLinks();
  },

  methods: {
    ...mapActions({
      fetchComponents: 'componentPatterns/fetchComponentPatterns',
      removeComponent: 'componentPatterns/removeComponentPattern',
      changePage: 'componentPatterns/changePage',
    }),

    setBreadcrumbsLinks() {
      this.$store.commit('UPDATE_BREADCRUMBS_LINKS', [
        {
          url: '/',
          label: 'Home',
        },
        {
          url: `/components/`,
          label: 'Components',
        },
      ]);
    },

    search(evt) {
      if (this.timeout) clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.$store.dispatch(
          'componentPatterns/searchComponentPattern',
          evt.target.value
        );
      }, 200);
    },
  },
};
</script>
