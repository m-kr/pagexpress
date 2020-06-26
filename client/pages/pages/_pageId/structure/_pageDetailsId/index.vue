<template>
  <div class="structure-builder">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li>
          <nuxt-link
            :to="`/pages/${$route.params.pageId}/edit`"
            aria-current="page"
          >
            Page edit
          </nuxt-link>
        </li>
        <li class="is-active">
          <nuxt-link
            :to="
              `/pages/${$route.params.pageId}/structure/${$route.params.pageDetailsId}`
            "
            aria-current="page"
          >
            Page structure
          </nuxt-link>
        </li>
      </ul>
    </nav>

    <div v-if="componentPatterns" class="components-wrapper">
      <PageComponent
        v-for="component in components"
        :key="component._id"
        :component-pattern="getComponentPattern(component.componentPatternId)"
        :field-types="fieldTypes"
        :data="component.data"
        :order="component.order"
        :attributes="component.attributes"
        :update-component="updateComponent.bind(null, component._id)"
      >
        <SelectWithAction
          label="Add component"
          :options="componentPatternsOptions"
          :action="addComponent"
        />
      </PageComponent>

      <SelectWithAction
        label="Add component"
        :options="componentPatternsOptions"
        :action="addComponent"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PageComponent from '@/components/PageComponent';
import SelectWithAction from '@/components/SelectWithAction';

export default {
  components: {
    PageComponent,
    SelectWithAction,
  },

  computed: {
    ...mapState({
      componentPatterns: state => state.componentPatterns.patterns,
      components: state => state.pageDetails.components,
      fieldTypes: state => state.fieldTypes.types,
    }),

    componentPatternsOptions() {
      if (!this.componentPatterns) {
        return;
      }

      return this.componentPatterns.map(pattern => {
        return {
          value: pattern._id,
          name: pattern.name,
        };
      });
    },
  },

  mounted() {
    this.initPageData();
  },

  methods: {
    async initPageData() {
      await this.$store.dispatch(
        'pageDetails/fetchPageDetails',
        this.$route.params.pageDetailsId
      );

      await this.$store.dispatch('componentPatterns/fetchPatterns');
      await this.$store.dispatch('fieldTypes/fetchFieldTypes');
    },

    addComponent(componentPatternId) {
      this.$store.dispatch('pageDetails/addComponent', { componentPatternId });
    },

    updateComponent(componentId, componentData) {
      this.$store.commit('pageDetails/UPDATE_COMPONENT', {
        _id: componentId,
        ...componentData,
      });
    },

    getComponentPattern(patternId) {
      if (!this.componentPatterns || !patternId) {
        return;
      }

      return this.componentPatterns.find(pattern => pattern._id === patternId);
    },
  },
};
</script>
