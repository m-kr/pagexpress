<template>
  <div class="structure-builder">
    <Toolbar>
      <template #left>
        <ComponentSelector
          color="success"
          :component-patterns="componentPatterns ? componentPatterns : []"
          :select-action="patternId => addComponent(patternId)"
        />
        <button v-if="clipboard" class="button is-info" @click="clearClipboard">
          Cancel {{ clipboard.type }}
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
    <div
      v-if="componentPatterns && componentPatterns.length"
      class="components-tree"
    >
      <ComponentTreeNode
        v-for="(component, index) in rootComponents"
        :key="component._id"
        :component="component"
        :first-root="index === 0"
        :component-patterns="componentPatterns"
        :get-child-components="getChildComponents"
        :empty-clipboard="clipboard === null"
        :edit="toggleModalComponent"
        :add="showComponentFinder"
        :remove="removeComponent"
        :clone="cloneComponent"
        :in-clipboard="inClipboard"
        :copy="copyComponentToClipboard"
        :cut="cutComponentToClipboard"
        :paste="pasteFromClipboard"
      />
    </div>
    <ComponentsFinder
      :component-patterns="componentPatterns"
      :add-component="addComponentInPlace"
      :show-finder="showFinder"
      :close-callback="closeFinder"
      :place-index="addToNodeParams.placeIndex"
      :parent-component-id="addToNodeParams.parentComponentId"
    />
    <ModalComponent
      :visible="editedComponent !== null"
      :component="editedComponent"
      :update-component="updateComponent"
      :component-patterns="componentPatterns"
      :toggle-visibility="toggleModalComponent"
      :save="saveChanges"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import {
  ComponentSelector,
  ComponentsFinder,
  ComponentTreeNode,
  ModalComponent,
  Toolbar,
} from '@/components';
import { getAllDescendants, targetComponentPosition } from '@/utils';

export default {
  components: {
    ComponentSelector,
    ComponentsFinder,
    ComponentTreeNode,
    ModalComponent,
    Toolbar,
  },

  data() {
    return {
      clipboard: null,
      addToNodeParams: {},
      showFinder: false,
      editedComponentId: null,
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

    editedComponent() {
      return this.editedComponentId
        ? this.components.find(
            component => component._id === this.editedComponentId
          )
        : null;
    },
  },

  mounted() {
    this.initPageData();
  },

  methods: {
    ...mapActions('pageDetails', [
      'addComponent',
      'addComponentInPlace',
      'copyComponent',
      'moveComponent',
      'removeComponent',
      'reorderComponents',
      'updateComponent',
    ]),

    toggleModalComponent(component) {
      this.editedComponentId = this.editedComponentId ? null : component._id;
    },

    clearClipboard() {
      this.clipboard = null;
    },

    inClipboard(componentId) {
      if (this.clipboard) {
        const clipboardNodeWithDescendant = getAllDescendants(
          this.clipboard.payload._id,
          this.components
        );

        return clipboardNodeWithDescendant.includes(componentId)
          ? this.clipboard.type
          : false;
      }

      return false;
    },

    getComponentPattern(patternId) {
      return this.componentPatterns.find(pattern => pattern._id === patternId);
    },

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

    addToClipboard(actionType, position, payload) {
      this.clipboard = {
        type: actionType,
        position,
        payload,
      };
    },

    getComponentPosition(componentId) {
      let position;

      this.components.some((c, index) => {
        position = index;

        return c._id === componentId;
      });

      return position;
    },

    cloneComponent({ data, _id, componentPatternId, parentComponentId }) {
      this.copyComponent({
        parentComponentId,
        previousComponentId: _id,
        componentPatternId,
        clipboard: {
          type: 'copy',
          payload: {
            _id,
            componentPatternId,
            data,
          },
        },
      });
    },

    cutComponentToClipboard(component, index) {
      this.addToClipboard(
        'cut',
        this.getComponentPosition(component.id),
        component
      );
    },

    copyComponentToClipboard(component) {
      this.addToClipboard(
        'copy',
        this.getComponentPosition(component.id),
        component
      );
    },

    pasteFromClipboard(targetPlaceParams) {
      if (this.clipboard.type === 'copy') {
        this.copyComponent({
          ...targetPlaceParams,
          clipboard: this.clipboard,
        });
      } else if (this.clipboard.type === 'cut') {
        this.moveComponent({
          ...targetPlaceParams,
          clipboard: this.clipboard,
        });
      }

      this.clipboard = null;
    },

    showComponentFinder({ parentComponentId, ...targetPlaceParams }) {
      this.addToNodeParams = {
        placeIndex: targetComponentPosition({
          ...targetPlaceParams,
          components: this.components,
        }),
        parentComponentId,
      };

      this.showFinder = true;
    },

    closeFinder() {
      this.addToNodeParams = {};
      this.showFinder = false;
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

.components-tree {
  padding: var(--spacing-2) 0;
}
</style>
