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

    <div class="columns">
      <div class="column buttons">
        <button class="button is-primary" @click="saveChanges">
          Save changes
        </button>
        <button class="button is-info" @click="collapseAllComponents">
          Collapse all
        </button>
      </div>
    </div>

    <Container
      v-if="componentPatterns && componentPatterns.length"
      class="components-wrapper"
      drag-handle-selector=".card-header__grab-handler"
      :drop-placeholder="dropPlaceholderOptions"
      @drop="onDrop"
    >
      <Draggable v-for="component in rootComponents" :key="component._id">
        <PageComponent
          :child-components="getChildComponents(component._id)"
          :component-patterns="componentPatterns"
          :component="component"
          :field-types="fieldTypes"
          :update-component="updateComponent"
          :remove-component="removeComponent"
          :collapsed="collapsedComponents.includes(component._id)"
          :toggle-collapsed-state="toggleCollapsedState"
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
      </Draggable>
    </Container>
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
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { Container, Draggable } from 'vue-smooth-dnd';
import PageComponent from '@/components/PageComponent';
import SelectWithAction from '@/components/SelectWithAction';

export default {
  components: {
    PageComponent,
    SelectWithAction,
    Draggable,
    Container,
  },

  data() {
    return {
      collapsedComponents: [],
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    };
  },

  computed: {
    ...mapState({
      componentPatterns: state => state.componentPatterns.patterns,
      components: state => state.pageDetails.components,
      fieldTypes: state => state.fieldTypes.types,
    }),

    ...mapGetters('pageDetails', ['rootComponents']),

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

    rootComponents() {
      return this.components.filter(component => !component.parentComponentId);
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

    onDrop(dragResults) {
      this.$store.dispatch('pageDetails/reorderRootComponents', dragResults);
    },

    collapseAllComponents() {
      this.collapsedComponents = this.rootComponents.map(
        component => component._id
      );
    },

    toggleCollapsedState(targetComponentId) {
      if (this.collapsedComponents.includes(targetComponentId)) {
        this.collapsedComponents = this.collapsedComponents.filter(
          componentId => componentId !== targetComponentId
        );
      } else {
        this.collapsedComponents.push(targetComponentId);
      }
    },

    removeComponent(componentId) {
      this.$store.commit('pageDetails/REMOVE_COMPONENT', componentId);
    },

    // Move them to getters
    getChildComponents(parentId) {
      return this.components.filter(
        component => component.parentComponentId === parentId
      );
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

  & > .smooth-dnd-draggable-wrapper {
    overflow: visible;
  }
}
</style>
