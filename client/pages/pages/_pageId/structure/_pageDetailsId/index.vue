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
        v-for="component in getRootComponents(components)"
        :key="component._id"
        :child-components="getChildComponents(component._id)"
        :component-patterns="componentPatterns"
        :component="component"
        :field-types="fieldTypes"
        :update-component="updateComponent"
      >
        <div class="field is-grouped add-component">
          <SelectWithAction
            placeholder="Choose component"
            button-label="Add inner component"
            :options="componentPatternsOptions"
            :action="patternId => addComponent(patternId, component._id)"
          />
        </div>
      </PageComponent>

      <div class="field is-grouped add-component">
        <button class="button is-primary" @click="saveChanges">
          Save changes
        </button>

        <SelectWithAction
          placeholder="Choose component"
          button-label="Add component"
          :options="componentPatternsOptions"
          :action="patternId => addComponent(patternId)"
        />
      </div>
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

    async saveChanges() {
      await this.$store.dispatch('pageDetails/savePageDetails');
    },

    addComponent(componentPatternId, parentComponentId) {
      this.$store.dispatch('pageDetails/addComponent', {
        componentPatternId,
        parentComponentId,
      });
    },

    updateComponent(componentId, componentData) {
      this.$store.commit('pageDetails/UPDATE_COMPONENT', {
        _id: componentId,
        ...componentData,
      });
    },

    // Move them to getters
    getChildComponents(parentId) {
      return this.components.filter(
        component => component.parentComponentId === parentId
      );
    },

    getRootComponents() {
      return this.components.filter(component => !component.parentComponentId);
    },
  },
};
</script>

<style scoped lang="postcss">
.add-component {
  margin-top: var(--spacing);
}

.field {
  &.add-component {
    justify-content: space-between;
  }
}

.components-wrapper {
  & > *:not(:last-of-type) {
    margin-bottom: var(--spacing-2);
  }
}
</style>
