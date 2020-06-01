<template>
  <div class="page-edit">
    <div v-if="mainData" class="panel is-link">
      <p class="panel-heading">Main parameters</p>

      <div class="panel-block">
        <div class="columns">
          <div class="column">
            <div class="field is-fullwidth">
              <label for="title" class="label">Name</label>
              <div class="control">
                <input
                  id="title"
                  :value="mainData.name"
                  class="input"
                  type="text"
                  name="name"
                  placeholder="Page name"
                  @input="updateMainData('name', $event.target.value)"
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
                  :value="mainData.url"
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
              <label for="type" class="label">Type</label>
              <div class="control">
                <input
                  id="type"
                  :value="mainData.type.name"
                  class="input"
                  type="text"
                  name="type"
                  placeholder="Page type"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="attributesSchema" class="panel is-link">
      <p class="panel-heading">Page attributes</p>

      <div
        v-for="attributeSchema of attributesSchema"
        :key="attributeSchema._id"
        class="panel-block"
      >
        <div class="columns">
          <div class="column">
            <div class="field is-fullwidth">
              <label :for="attributeSchema.name" class="label">{{
                attributeSchema.name
              }}</label>
              <div class="control">
                <input
                  :id="attributeSchema.name"
                  :value="pageAttributes[attributeSchema.name]"
                  class="input"
                  type="text"
                  name="description"
                  :placeholder="attributeSchema.description"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mainData" class="panel is-primary">
      <p class="panel-heading">Page variants details</p>

      <div class="columns">
        <div class="column">
          <div class="tabs">
            <ul>
              <li
                v-if="mainData.pageDetails && mainData.pageDetails.length"
                class="is-active"
              >
                <a>Edit</a>
              </li>
              <li><a>Add new +</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="panel-block">
        <div class="columns">
          <div class="column">
            <div class="field is-horizontal has-addons">
              <div class="field-label is-normal">
                <label class="label" for="details">Page variants</label>
              </div>
              <div class="field-body">
                <div class="control is-expanded">
                  <div class="select is-fullwidth">
                    <select id="details">
                      <option
                        v-for="variant of pageVariants"
                        :key="variant._id"
                        :value="variant._id"
                        >{{ variant.name }}</option
                      >
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  // asyncData({ params, store }) {
  //   store.dispatch('page/', { pageId: params.id });
  // },

  computed: {
    ...mapState({
      mainData: state => state.page.mainData,
      attributesSchema: state => state.page.attributesSchema,
      pageAttributes: state => state.page.pageAttributes,
      pageVariants: state => state.page.pageVariants,
      pageDetails: state => state.page.pageDetails,
      unsaveData: state => state.page.unsaveData,
      fieldTypes: state => state.fieldTypes.types,
      pageTypes: state => state.pageTypes.types,
      pageAttributeTypes: state => state.pageAttributeTypes.types,
    }),

    pageId() {
      return this.$route.params.id;
    },
  },

  mounted() {
    this.initPageData();
  },

  methods: {
    async initPageData(pageId) {
      await this.$store.dispatch('pageTypes/fetchPageTypes');
      await this.$store.dispatch('fieldTypes/fetchFieldTypes');
      await this.$store.dispatch('page/fetchPageData', {
        pageId: pageId || this.$route.params.id,
      });
    },

    updateMainData(field, value) {
      this.$store.commit('page/UPDATE_MAIN_DATA', { [field]: value });
    },
  },
};
</script>

<style>
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
