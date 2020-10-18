<template>
  <div class="menus">
    <div class="menus__toolbar">
      <div class="columns">
        <div class="column">
          <div v-if="menus" class="field">
            <label class="label" for="edit-menu">Edit menu</label>
            <div class="control">
              <div class="select">
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
        </div>
        <div class="column is-narrow">
          <div class="field">
            <label class="label" for="new-menu">New menu</label>
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
                <button class="button is-primary" :disabled="!menuName.length">
                  Create menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-menu">
      <div class="columns">
        <div class="column">
          <div class="menu-items">
            <div class="pages"></div>
            <div class="custom-link"></div>
          </div>
        </div>
        <div class="column">
          <div v-if="activeMenu" class="menu-structure">
            <MenuItems :chunk="activeMenu.items" :update="updateMenuItems" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MenuItems from '@/components/MenuItems';

export default {
  components: { MenuItems },

  data() {
    return {
      menuName: '',
      activeMenuId: null,
    };
  },

  computed: {
    ...mapState({
      menus: state => state.menus.menus,
    }),

    activeMenu() {
      return this.menus.find(menu => menu._id === this.activeMenuId);
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

    updateMenuItems(dragResults, parentItemId) {
      this.$store.commit('menus/REORDER_MENU', {
        menuId: this.activeMenuId,
        dragResults,
        parentItemId,
      });
    },
  },
};
</script>
