<template>
  <div class="structure-builder">
    <Toolbar>
      <template #left>
        <ComponentSelector
          color="success"
          :component-patterns="componentPatterns ? componentPatterns : []"
          :select-action="patternId => addComponent(patternId)"
        />
        <button class="button is-info" @click="collapseAllComponents">
          Collapse all
        </button>
      </template>

      <template #right>
        <a
          v-if="previewLink"
          ref="noindex nofollow noreferrer"
          :href="previewLink"
          target="_blank"
          class="button"
          >Preview</a
        >
        <button
          class="button is-success"
          :disabled="!isDirty"
          @click="saveChanges"
        >
          Save
        </button>
      </template>
    </Toolbar>

    <Container
      v-if="componentPatterns && componentPatterns.length"
      class="components-wrapper"
      drag-handle-selector=".card-header__grab-handler.root"
      :drop-placeholder="dropPlaceholderOptions"
      @drop="onDrop"
    >
      <Draggable
        v-for="(component, rowIndex) in rootComponents"
        :key="component._id"
        class="card"
      >
        <PageComponent
          :component-patterns="componentPatterns"
          :component="component"
          :add-component="addComponent"
          :update-component="updateComponent"
          :remove-component="removeComponent"
          :get-child-components="getChildComponents"
          :drop-placeholder-options="dropPlaceholderOptions"
          :reorder="reorderComponents"
          :collapsed="collapsedComponents.includes(component._id)"
          :toggle-collapsed-state="toggleCollapsedState"
          :is-root-component="true"
        >
          <div class="add-component__container">
            <ComponentSelector
              :component-patterns="componentPatterns ? componentPatterns : []"
              label="Place component"
              size="small"
              color="primary"
              button-style="light"
              :select-action="
                patternId => addComponentAfterSelf(patternId, rowIndex + 1)
              "
            />
          </div>
        </PageComponent>
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { Container, Draggable } from 'vue-smooth-dnd';
import { ComponentSelector, PageComponent, Toolbar } from '@/components';

export default {
  components: {
    ComponentSelector,
    Container,
    Draggable,
    PageComponent,
    Toolbar,
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
      componentPatterns: state => state.componentPatterns.componentPatterns,
      components: state => state.pageDetails.components,
      isDirty: state => state.isDirty,
      siteInfo: state => state.siteInfo,
      pageData: state => state.page.mainData,
    }),
    ...mapGetters('pageDetails', ['rootComponents']),

    previewLink() {
      if (
        !(this.siteInfo && !!(this.siteInfo.previewUrl || this.siteInfo.url))
      ) {
        return null;
      }

      let previewLink = this.siteInfo.previewUrl || this.siteInfo.url;
      previewLink += `${this.pageData.url}?preview=${this.$route.params.pageId}`;

      return previewLink;
    },
  },

  mounted() {
    this.initPageData();
  },

  methods: {
    ...mapActions({
      reorderComponents: 'pageDetails/reorderComponents',
    }),
    async initPageData() {
      this.setBreadcrumbsLinks();
      await this.$store.dispatch(
        'pageDetails/fetchPageDetails',
        this.$route.params.pageDetailsId
      );
      await this.$store.dispatch('page/fetchPageData', {
        pageId: this.$route.params.pageId,
      });
      await this.$store.dispatch('componentPatterns/fetchComponentPatterns', {
        itemsPerPage: null,
      });
      await this.$store.dispatch('fetchSiteInfo');
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

    addComponentAfterSelf(componentPatternId, targetPlaceIndex) {
      this.$store.dispatch('pageDetails/addComponentInPlace', {
        componentPatternId,
        targetPlaceIndex,
      });
    },

    setBreadcrumbsLinks() {
      this.$store.commit('UPDATE_BREADCRUMBS_LINKS', [
        {
          url: '/',
          label: 'Home',
        },
        {
          url: `/pages/${this.$route.params.pageId}/edit/`,
          label: 'Page edit',
        },
        {
          url: `/pages/${this.$route.params.pageId}/structure/${this.$route.params.pageDetailsId}`,
          label: 'Page structure',
        },
      ]);
    },

    updateComponent(componentId, componentData) {
      this.$store.dispatch('pageDetails/updateComponent', {
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
      this.$store.dispatch('pageDetails/removeComponent', componentId);
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
.add-component__container {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing);

  & > * {
    &:not(:last-of-type) {
      margin-right: var(--spacing);
    }
  }
}

.components-wrapper {
  & > *:not(:last-of-type) {
    margin-bottom: var(--spacing-2);
  }

  /* Fix issue with missing box shadow */
  &.smooth-dnd-container {
    &.vertical {
      & > .smooth-dnd-draggable-wrapper {
        overflow: visible;
      }
    }
  }
}
</style>
