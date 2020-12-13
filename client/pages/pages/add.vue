<template>
  <div class="page-add">
    <div class="panel">
      <p class="panel-heading">Main parameters</p>

      <div class="panel-block">
        <div class="columns">
          <div class="column">
            <div class="field is-fullwidth">
              <label for="title" class="label">Name</label>
              <div class="control">
                <input
                  id="title"
                  v-model="mainData.name"
                  class="input"
                  type="text"
                  name="name"
                  placeholder="Page name"
                />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field is-fullwidth">
              <label for="url" class="label">Page URL (absolute path)</label>
              <div class="control">
                <input
                  id="url"
                  v-model="mainData.url"
                  class="input"
                  type="text"
                  name="url"
                  placeholder="URL"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field is-fullwidth">
              <label for="pageType" class="label">Type</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select id="pageType" v-model="mainData.type">
                    <option
                      v-for="type of pageTypes"
                      :key="type._id"
                      :value="type._id"
                      :selected="type.name === 'default'"
                      >{{ type.name }}</option
                    >
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mainData.type" class="panel">
      <p class="panel-heading">Page attributes</p>

      <div
        v-for="pageAttribute of pageTypeAttributes"
        :key="pageAttribute._id"
        class="panel-block"
      >
        <div class="columns">
          <div class="column">
            <Field
              :field-type="getPageType(pageAttribute.type)"
              :value="attributes[pageAttribute.name]"
              :label="pageAttribute.description"
              :options="pageAttribute.options"
              :update="value => updateAttribute(pageAttribute.name, value)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-pulled-right">
        <button class="button is-primary" @click="addPage">
          Add page
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Field from '@/components/Field';

export default {
  components: {
    Field,
  },
  data() {
    return {
      mainData: {},
      attributes: {},
    };
  },

  computed: {
    ...mapState({
      fieldTypes: state => state.fieldTypes.types,
      pageTypes: state => state.pageTypes.types,
      pageAttributeTypes: state => state.pageAttributeTypes.types,
    }),

    pageTypeAttributes() {
      if (!this.mainData.type) {
        return null;
      }

      const pageTypeData = this.pageTypes.find(
        type => type._id === this.mainData.type
      );

      return pageTypeData.attributes;
    },
  },

  mounted() {
    this.initPageData();
  },

  methods: {
    async initPageData() {
      this.setBreadcrumbsLinks();
      await this.$store.dispatch('pageTypes/fetchPageTypes');
      await this.$store.dispatch('fieldTypes/fetchFieldTypes');
      await this.$store.dispatch('pageAttributeTypes/fetchPageAttributeTypes');
    },

    async addPage() {
      await this.$store.dispatch('page/addPage', {
        ...this.mainData,
        attributes: this.attributes,
      });

      const newPageId = this.$store.state.page.newPageId;

      if (newPageId) {
        await this.$router.push({
          path: `/pages/${newPageId}/edit`,
        });
      }
    },

    getPageType(pageTypeId) {
      return this.pageAttributeTypes.find(type => type._id === pageTypeId).type;
    },

    setBreadcrumbsLinks() {
      this.$store.commit('UPDATE_BREADCRUMBS_LINKS', [
        {
          url: '/',
          label: 'Home',
        },
        {
          url: '/pages/add',
          label: 'Add page',
        },
      ]);
    },

    updateAttribute(name, value) {
      this.$set(this.attributes, name, value);
    },
  },
};
</script>

<style lang="postcss">
.panel-block {
  flex-direction: column;
  justify-content: space-around;
  padding-top: 1em;
  padding-bottom: 1.25em;

  & > * {
    width: 100%;
  }
}

.component-attribute {
  padding: 0.75em 0;

  &:not(:last-of-type) {
    margin-bottom: 0.75em;
  }
}
</style>
