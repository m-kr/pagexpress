<template>
  <div class="page-edit">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li class="is-active">
          <nuxt-link :to="`/pages/${$route.params.pageId}`" aria-current="page">
            Page edit
          </nuxt-link>
        </li>
      </ul>
    </nav>
    <div v-if="mainData" class="panel">
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
                  @input="updateMainData('url', $event.target.value)"
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
                  <select id="pageType">
                    <option
                      v-for="type of pageTypes"
                      :key="type._id"
                      :value="mainData.type.id"
                      @change="updateMainData('url', $event.target.value)"
                      >{{ type.name }}</option
                    >
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-block">
        <div class="columns">
          <div class="column">
            <button
              v-if="unsavedData.includes('mainData')"
              class="button is-success"
              @click="updatePage"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="pageAttributes && attributesSchema" class="panel">
      <p class="panel-heading">Page attributes</p>

      <div
        v-for="attributeSchema of attributesSchema"
        :key="attributeSchema._id"
        class="panel-block"
      >
        <div class="columns">
          <div class="column">
            <FieldList
              v-if="attributeSchema.type === 'list'"
              :label="attributeSchema.description"
              :values="pageAttributes[attributeSchema.name]"
              @update="value => updateAttribute(attributeSchema.name, value)"
            />

            <FieldText
              v-if="attributeSchema.type === 'text'"
              :label="attributeSchema.description"
              :value="pageAttributes[attributeSchema.name]"
              @update="value => updateAttribute(attributeSchema.name, value)"
            />

            <FieldHtml
              v-if="attributeSchema.type === 'html'"
              :label="attributeSchema.description"
              :value="pageAttributes[attributeSchema.name]"
              @update="value => updateAttribute(attributeSchema.name, value)"
            />
          </div>
        </div>
      </div>

      <div class="panel-block">
        <div class="columns">
          <div class="column">
            <button
              v-if="unsavedData.includes('attributes')"
              class="button is-success"
              @click="updatePage"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mainData" class="panel">
      <p class="panel-heading">Page variants details</p>

      <div class="columns">
        <div class="column">
          <div class="tabs">
            <ul>
              <li
                v-if="pageVariants && pageVariants.length"
                :class="activeDetailsTab === 'edit' ? 'is-active' : ''"
                @click.prevent="switchDetailsTab('edit')"
              >
                <a>Edit</a>
              </li>
              <li :class="activeDetailsTab === 'add' ? 'is-active' : ''">
                <a @click.prevent="switchDetailsTab('add')">Add new +</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="activeDetailsTab === 'add'" class="panel-block">
        <div class="columns">
          <div class="column">
            <div class="field is-fullwidth">
              <label for="new-page-details-name" class="label">
                Page variant name
              </label>
              <div class="control">
                <input
                  id="new-page-details-name"
                  :value="newPageDetails.name"
                  class="input"
                  type="text"
                  name="page-variant-name"
                  placeholder="Page variant name"
                  @input="updateNewPageVariant('name', $event.target.value)"
                />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="control is-expanded">
              <label for="new-page-details-country" class="label">
                Country
              </label>
              <div class="select is-fullwidth">
                <select
                  id="new-page-details-country"
                  :value="newPageDetails.country"
                  @change="updateNewPageVariant('country', $event.target.value)"
                >
                  <option value="" selected disabled hidden>
                    -- Choose country --
                  </option>
                  <option
                    v-for="country of countries"
                    :key="country._id"
                    :value="country._id"
                  >
                    {{ country.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field is-fullwidth">
              <label for="new-page-details-title" class="label">
                Title
              </label>
              <div class="control">
                <input
                  id="new-page-details-title"
                  :value="newPageDetails.title"
                  class="input"
                  type="text"
                  name="page-title"
                  placeholder="Page title"
                  @input="updateNewPageVariant('title', $event.target.value)"
                />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field is-fullwidth">
              <label for="new-page-details-description" class="label">
                Description
              </label>
              <div class="control">
                <input
                  id="new-page-details-description"
                  :value="newPageDetails.description"
                  class="input"
                  type="text"
                  name="page-description"
                  placeholder="Page description"
                  @input="
                    updateNewPageVariant('description', $event.target.value)
                  "
                />
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <label for="page-template" class="label">
                Build page structure draft from template
              </label>
              <div class="select is-fullwidth">
                <select id="page-template" v-model="pageTemplateId">
                  <option value="">Build without template</option>
                  <option
                    v-for="template of pageTemplates"
                    :key="template._id"
                    :value="template._id"
                  >
                    {{ template.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <button
              type="submit"
              class="button is-success"
              @click="addPageVariant"
            >
              Add page variant
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="pageVariants && activeDetailsTab === 'edit'"
        class="panel-block"
      >
        <div class="columns">
          <div class="column">
            <div class="field is-horizontal has-addons">
              <div class="field-label is-normal">
                <label class="label" for="details">Page variant</label>
              </div>
              <div class="field-body">
                <div class="control is-expanded">
                  <div class="select is-fullwidth">
                    <select
                      id="details"
                      @change="switchPageDetailsData($event.target.value)"
                    >
                      <option
                        v-for="variant of pageVariants"
                        :key="variant._id"
                        :value="variant._id"
                      >
                        {{ variant.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field is-fullwidth">
              <label for="page-details-name" class="label">
                Page variant name
              </label>
              <div class="control">
                <input
                  id="page-details-name"
                  :value="pageDetails.name"
                  class="input"
                  type="text"
                  name="page-variant-name"
                  placeholder="Page variant name"
                  @input="updatePageDetails('title', $event.target.value)"
                />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="control is-expanded">
              <label for="page-details-country" class="label">
                Country
              </label>
              <div class="select is-fullwidth">
                <select
                  id="page-details-country"
                  :value="pageDetails.country"
                  @change="updatePageDetails('country', $event.target.value)"
                >
                  <option
                    v-for="country of countries"
                    :key="country._id"
                    :value="country._id"
                  >
                    {{ country.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field is-fullwidth">
              <label for="page-details-title" class="label">
                Title
              </label>
              <div class="control">
                <input
                  id="page-details-title"
                  :value="pageDetails.title"
                  class="input"
                  type="text"
                  name="page-title"
                  placeholder="Page title"
                  @input="updatePageDetails('title', $event.target.value)"
                />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field is-fullwidth">
              <label for="page-details-description" class="label">
                Description
              </label>
              <div class="control">
                <input
                  id="page-details-description"
                  :value="pageDetails.description"
                  class="input"
                  type="text"
                  name="page-description"
                  placeholder="Page description"
                  @input="updatePageDetails('description', $event.target.value)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column buttons">
            <button
              v-if="unsavedData.includes('pageDetails')"
              type="submit"
              class="button is-success"
              @click="updatePage"
            >
              Save changes
            </button>
            <nuxt-link
              class="button is-link"
              :to="`/pages/${pageId}/structure/${pageDetails._id}`"
            >
              Edit page variant
            </nuxt-link>
            <button class="button is-black" @click="downloadPageStructure">
              Download Page JSON schema
            </button>
            <button
              class="button is-danger is-right"
              @click="removePageVariant"
            >
              Remove page variant
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { FieldText, FieldHtml, FieldList } from '@/components';
import { downloadJsonFile, getSlug } from '@/utils';

export default {
  components: {
    FieldHtml,
    FieldText,
    FieldList,
  },
  data() {
    return {
      activeDetailsTab: null,
      pageTemplateId: '',
    };
  },

  computed: {
    ...mapState({
      mainData: state => state.page.mainData,
      attributesSchema: state => state.page.attributesSchema,
      pageAttributes: state => state.page.pageAttributes,
      pageVariants: state => state.page.pageVariants,
      pageDetails: state => state.page.pageDetails,
      unsavedData: state => state.page.unsavedData,
      fieldTypes: state => state.fieldTypes.types,
      pageTypes: state => state.pageTypes.types,
      countries: state => state.countries.countries,
      pageAttributeTypes: state => state.pageAttributeTypes.types,
      newPageDetails: state => state.pageDetails.details,
      pageTemplates: state => state.pageTemplates.templates,
    }),

    pageId() {
      return this.$route.params.pageId;
    },

    pageStructureJsonFilePath() {
      return `${process.env.API_URL}/page-structure/${this.$route.params.pageId}`;
    },
  },

  mounted() {
    this.initPageData();
  },

  methods: {
    async initPageData(pageId) {
      this.$store.commit('pageDetails/RESET_DETAILS');
      await this.$store.dispatch('pageTypes/fetchPageTypes');
      await this.$store.dispatch('fieldTypes/fetchFieldTypes');
      await this.$store.dispatch('countries/fetchCountries');
      await this.$store.dispatch('pageTemplates/fetchTemplates');
      await this.$store.dispatch('page/fetchPageData', {
        pageId: pageId || this.$route.params.pageId,
      });

      const { pageVariants } = this.$store.state.page;

      if (pageVariants && pageVariants.length) {
        this.activeDetailsTab = 'edit';
        this.switchPageDetailsData(pageVariants[0]._id);
      } else {
        this.activeDetailsTab = 'add';
      }
    },

    async addPageVariant() {
      const pageVariantsQtty = this.pageVariants.length;
      await this.$store.dispatch('pageDetails/addPageDetails', {
        pageId: this.pageId,
        templateComponents: this.getActivePageTemplateComponents(),
      });

      if (this.$store.state.page.pageVariants.length > pageVariantsQtty) {
        this.activeDetailsTab = 'edit';
      }
    },

    async removePageVariant() {
      const lastVariant = this.pageVariants.length === 1;
      await this.$store.dispatch(
        'pageDetails/removePageDetails',
        this.pageDetails._id
      );

      if (lastVariant) {
        this.activeDetailsTab = 'add';
      }
    },

    async updatePage() {
      await this.$store.dispatch('page/updatePage');
    },

    updateMainData(field, value) {
      this.$store.commit('page/UPDATE_MAIN_DATA', { [field]: value });
    },

    updateAttribute(field, value) {
      this.$store.commit('page/UPDATE_ATTRIBUTES', { [field]: value });
    },

    updatePageDetails(field, value) {
      this.$store.commit('page/UPDATE_DETAILS', { [field]: value });
    },

    updateNewPageVariant(field, value) {
      this.$store.commit('pageDetails/UPDATE_PAGE_DETAILS', { [field]: value });
    },

    switchPageDetailsData(pageDetailsId) {
      const pageDetails = this.pageVariants.find(
        variant => variant._id === pageDetailsId
      );
      this.$store.commit('page/UPDATE_DETAILS', pageDetails);
    },

    switchDetailsTab(tab) {
      this.activeDetailsTab = tab;
    },

    getActivePageTemplateComponents() {
      const templateData = this.pageTemplates.find(
        template => template._id === this.pageTemplateId
      );

      return templateData ? templateData.components : null;
    },

    downloadPageStructure() {
      downloadJsonFile(
        this.pageStructureJsonFilePath,
        getSlug(this.mainData.name)
      );
    },
  },
};
</script>

<style lang="postcss" scoped>
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
