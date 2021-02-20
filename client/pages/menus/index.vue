<template>
  <div class="menus">
    <div class="menus__toolbar">
      <div class="columns">
        <div class="column is-narrow">
          <div class="field is-horizontal">
            <div class="field-body">
              <div v-if="menus" class="field">
                <label class="label" for="edit-menu">Edit existed menu</label>
                <div class="control">
                  <div class="select select--full-width">
                    <select id="edit-menu" v-model="activeMenuId">
                      <option
                        v-for="menu in menus"
                        :key="menu._id"
                        :value="menu._id"
                      >
                        {{ menu.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="field">
                <label class="label" for="new-menu">Add new menu</label>
                <div class="field has-addons">
                  <div class="control">
                    <input
                      id="new-menu"
                      v-model="menuName"
                      class="input"
                      type="text"
                      placeholder="Menu name"
                    />
                  </div>
                  <div class="control">
                    <button
                      class="button is-primary"
                      :disabled="!menuName.length"
                      @click="addMenu"
                    >
                      Create menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column buttons right-buttons">
          <button
            class="button is-success"
            :disabled="!unsavedMenuChanges"
            @click="saveChanges"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
    <div class="edit-menu">
      <div class="columns">
        <div class="column is-one-third">
          <div class="panel is-info">
            <p class="panel-heading">
              Add new menu item
            </p>
            <div class="panel-block add-menu-item">
              <div class="control">
                <vue-autosuggest
                  v-model="filterAutosuggestKeyword"
                  :suggestions="autosuggestData"
                  :input-props="{
                    id: 'add-existed-page',
                    class: 'input has-icons-right',
                    placeholder: 'Search page',
                  }"
                  :get-suggestion-value="getSuggestionValue"
                  @selected="selectHandler"
                >
                  <div slot-scope="{ suggestion }">
                    <span class="autosuggest-item__row">
                      {{ suggestion.item.label }}
                    </span>
                    <span class="autosuggest-item__row">
                      {{ suggestion.item.url }}
                    </span>
                  </div>
                </vue-autosuggest>
              </div>
            </div>
            <div class="panel-block">
              <div class="panel-block__inner">
                <div class="field">
                  <label for="new-menu-item-label" class="label">Label</label>
                  <div class="control">
                    <input
                      id="new-menu-item-label"
                      v-model="newMenuItem.label"
                      type="text"
                      class="input"
                    />
                  </div>
                </div>
                <div class="field">
                  <label for="new-menu-item-url" class="label">URL</label>
                  <div class="control">
                    <input
                      id="new-menu-item-url"
                      v-model="newMenuItem.url"
                      type="text"
                      class="input"
                    />
                  </div>
                </div>
                <div v-if="menus" class="field">
                  <label class="label" for="new-menu-parent-item">
                    Parent item
                  </label>
                  <div class="control">
                    <div class="select select--full-width">
                      <select
                        id="new-menu-parent-item"
                        v-model="newMenuItem.parentItem"
                      >
                        <option value="">No parent</option>
                        <option
                          v-for="item in activeMenuItems"
                          :key="item.id"
                          :value="item.id"
                        >
                          {{ item.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="panel-block">
              <button
                class="button is-link is-outlined is-fullwidth"
                :disabled="shouldBeEnabledAddItemButton"
                @click="addItem"
              >
                Add item
              </button>
            </div>
          </div>
          <button
            class="button is-danger is-fullwidth"
            :disabled="!activeMenuId"
            @click="removeMenu"
          >
            Delete Menu
          </button>
        </div>
        <div class="column">
          <div v-if="activeMenu" class="menu-structure">
            <MenuItems
              :chunk="activeMenu.items"
              :reorder="reorderMenu"
              :remove-item="removeItem"
              :update-item="updateItem"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { VueAutosuggest } from 'vue-autosuggest';
import MenuItems from '@/components/MenuItems';
import { getNestedThingsByKey, stringMatch } from '@/utils';

export default {
  components: {
    MenuItems,
    VueAutosuggest,
  },

  data() {
    return {
      newMenuItem: {
        parentItem: '',
      },
      menuName: '',
      activeMenuId: null,
      filterAutosuggestKeyword: '',
      unsavedMenus: [],
    };
  },

  computed: {
    ...mapState({
      menus: state => state.menus.menus,
      pages: state => state.pages.pagesList,
    }),

    autosuggestData() {
      let pagesData = this.pages.map(page => ({
        label: page.name,
        url: page.url,
      }));

      if (this.filterAutosuggestKeyword.length) {
        pagesData = pagesData.filter(
          page =>
            stringMatch(this.filterAutosuggestKeyword, page.label) ||
            stringMatch(this.filterAutosuggestKeyword, page.url)
        );
      }

      return [{ data: pagesData }];
    },

    activeMenu() {
      return this.activeMenuId
        ? this.$store.getters['menus/getMenuById'](this.activeMenuId)
        : null;
    },

    activeMenuItems() {
      if (!this.activeMenu || !this.activeMenu.items) return [];

      return getNestedThingsByKey(this.activeMenu.items, 'children');
    },

    shouldBeEnabledAddItemButton() {
      const { url, label } = this.newMenuItem;
      return !(url && url.length && label && label.length);
    },

    unsavedMenuChanges() {
      return this.unsavedMenus.includes(this.activeMenuId);
    },
  },

  async mounted() {
    await this.fetchMenus();
    await this.fetchPages();

    this.initActiveMenu();
    this.setBreadcrumbsLinks();
  },

  methods: {
    ...mapActions({
      fetchMenus: 'menus/fetchMenus',
      fetchPages: 'pages/loadPages',
      removeMenu: 'menus/removeMenu',
    }),

    initActiveMenu() {
      if (this.menus && this.menus.length) {
        this.activeMenuId = this.menus[0]._id;
      }
    },

    reorderMenu(dragResults, parentItemId) {
      this.$store.commit('menus/REORDER_MENU', {
        menuId: this.activeMenuId,
        dragResults,
        parentItemId,
      });

      if (!this.unsavedMenuChanges) {
        this.unsavedMenus.push(this.activeMenuId);
      }
    },

    addMenu() {
      this.$store.dispatch('menus/addMenu', this.menuName);
      this.menuName = '';
    },

    async saveChanges() {
      await this.$store.dispatch('menus/saveChanges', {
        menuId: this.activeMenuId,
      });

      this.unsavedMenus = this.unsavedMenus.filter(
        menuId => menuId !== this.activeMenuId
      );
    },

    addItem() {
      const { url, label, parentItem } = this.newMenuItem;
      this.$store.commit('menus/ADD_ITEM', {
        menuId: this.activeMenuId,
        label,
        url,
        parentItem: parentItem.length ? parentItem : null,
      });

      this.newMenuItem = {
        parentItem: '',
      };

      this.markMenuAsDirty();
    },

    removeItem(itemId) {
      this.$store.commit('menus/REMOVE_ITEM', {
        menuId: this.activeMenuId,
        itemId,
      });

      this.markMenuAsDirty();
    },

    removeMenu() {
      const availableMenus = this.menus.filter(
        menu => menu._id !== this.activeMenuId
      );
      this.$store.dispatch('menus/removeMenu', this.activeMenuId);

      this.activeMenuId = availableMenus[0]._id;
    },

    updateItem(newItemData) {
      this.$store.commit('menus/UPDATE_ITEM', {
        menuId: this.activeMenuId,
        newItemData,
      });

      this.markMenuAsDirty();
    },

    markMenuAsDirty() {
      if (!this.unsavedMenuChanges) {
        this.unsavedMenus.push(this.activeMenuId);
      }
    },

    getSuggestionValue(suggestion) {
      return suggestion.item.label;
    },

    selectHandler({ item }) {
      const { url, label } = item;

      this.newMenuItem = {
        ...this.newMenuItem,
        label,
        url,
      };

      this.filterAutosuggestKeyword = '';
    },

    setBreadcrumbsLinks() {
      this.$store.commit('UPDATE_BREADCRUMBS_LINKS', [
        {
          url: '/',
          label: 'Home',
        },
        {
          url: `/menu/`,
          label: 'Menu',
        },
      ]);
    },
  },
};
</script>

<style lang="postcss" scoped>
.menus {
  &__toolbar {
    margin-bottom: var(--spacing-2);

    .right-buttons {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }
  }
}
</style>
