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
                    >
                      Create menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  :suggestions="autosuggestData"
                  :input-props="{
                    id: 'add-existed-page',
                    class: 'input',
                    placeholder: 'Search page',
                  }"
                  :get-suggestion-value="getSuggestionValue"
                  @selected="selectHandler"
                  @click="clickHandler"
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
                @click="addItem"
              >
                Add item
              </button>
            </div>
          </div>
        </div>
        <div class="column">
          <div v-if="activeMenu" class="menu-structure">
            <MenuItems :chunk="activeMenu.items" :reorder="reorderMenu" />
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
import { getNestedThingsByKey } from '@/utils';

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
      autosuggestData: [
        {
          data: [
            { label: 'Sample page', url: '/sample-page' },
            { label: 'Second page', url: '/second-page' },
            { label: 'Other page', url: '/other-page' },
          ],
        },
      ],
    };
  },

  computed: {
    ...mapState({
      menus: state => state.menus.menus,
    }),

    activeMenu() {
      return this.menus.find(menu => menu._id === this.activeMenuId);
    },

    activeMenuItems() {
      if (!this.activeMenu || !this.activeMenu.items) return [];

      return getNestedThingsByKey(this.activeMenu.items, 'children');
    },
  },

  async mounted() {
    await this.fetchMenus();

    this.initActiveMenu();
  },

  methods: {
    ...mapActions({
      fetchMenus: 'menus/fetchMenus',
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
    },

    addItem() {
      console.log('Add item', this.newMenuItem);
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
    },

    clickHandler(value) {
      console.log('clickHandler', value);
    },
  },
};
</script>

<style lang="postcss" scoped>
.menus {
  &__toolbar {
    margin-bottom: var(--spacing-2);
  }
}
</style>
