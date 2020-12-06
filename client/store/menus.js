import { v4 as uuidv4 } from 'uuid';
import {
  enrichById,
  reorderItems,
  showRequestResult,
  updateAllNestedItems,
  updateItemChildren,
  updateNestedItem,
} from '@/utils';

export const state = () => ({
  menus: [],
});

export const getters = {
  getMenuById: state => menuId => {
    return state.menus.find(menu => menu._id === menuId);
  },
};

export const mutations = {
  FETCH_MENUS(state, menus) {
    state.menus = menus;
  },

  ADD_MENU(state, newMenu) {
    state.menus.push(newMenu);
  },

  REORDER_MENU(state, { menuId, dragResults, parentItemId }) {
    for (const menu of state.menus) {
      if (menu._id === menuId) {
        menu.items = !parentItemId
          ? reorderItems(menu.items, dragResults)
          : updateItemChildren(menu.items, parentItemId, items =>
              reorderItems(items, dragResults)
            );

        break;
      }
    }
  },

  ADD_ITEM(state, { menuId, label, url, parentItem }) {
    const newItem = enrichById({
      label,
      url,
      children: [],
    });

    const targetMenu = state.menus.find(menu => menu._id === menuId);

    if (!targetMenu.items) {
      targetMenu.items = [];
    }

    if (!parentItem) {
      targetMenu.items.push(newItem);
    }

    updateNestedItem(targetMenu.items, parentItem, 'children', item => {
      if (!item.children) {
        item.children = [];
      }

      item.children.push(newItem);
    });
  },

  UPDATE_ITEM(state, { menuId, newItemData }) {
    const targetMenu = state.menus.find(menu => menu._id === menuId);

    updateNestedItem(
      targetMenu.items,
      newItemData.id,
      'children',
      (itemToUpdate, itemIndex, items) => {
        items.splice(itemIndex, 1, newItemData);
      }
    );
  },

  REMOVE_ITEM(state, { menuId, itemId }) {
    const targetMenu = state.menus.find(menu => menu._id === menuId);

    updateNestedItem(
      targetMenu.items,
      itemId,
      'children',
      (itemToRemove, itemIndex, items) => {
        items.splice(itemIndex, 1);
      }
    );
  },

  REMOVE_MENU(state, menuId) {
    state.menus = state.menus.filter(menu => menu._id !== menuId);
  },
};

export const actions = {
  async fetchMenus({ commit, dispatch }) {
    const menus = await showRequestResult({
      request: this.$axios.get('menus'),
      dispatch,
    });

    return commit(
      'FETCH_MENUS',
      menus.map(menu => ({
        ...menu,
        items: updateAllNestedItems(menu.items, 'children', item => {
          if (!item.children) {
            item.children = [];
          }

          item.id = uuidv4();
        }),
      }))
    );
  },

  async addMenu({ commit, dispatch }, menuName) {
    const menuId = await showRequestResult({
      request: this.$axios.post(`menus`, { name: menuName }),
      dispatch,
      successMessage: `Added new menu: ${menuName}`,
    });

    commit('ADD_MENU', { _id: menuId, name: menuName });
  },

  async saveChanges({ commit, dispatch, state }, { menuId, callback }) {
    const { items, name } = {
      ...state.menus.find(menu => menu._id === menuId),
    };

    const itemsToSave = updateAllNestedItems(items, 'children', item => {
      if (item.children && !item.children.length) {
        delete item.children;
      }

      delete item.id;
    });

    await showRequestResult({
      request: this.$axios.put(`menus/${menuId}`, {
        name,
        items: itemsToSave,
      }),
      successMessage: 'Saved changes',
      dispatch,
    });

    if (callback) {
      callback();
    }
  },

  async removeMenu({ commit, dispatch }, menuId) {
    if (!confirm('Please, confirm removing menu')) {
      return;
    }

    const removedMenuId = await showRequestResult({
      request: this.$axios.delete(`menus/${menuId}`),
      successMessage: 'Menu has been removed',
      dispatch,
    });

    commit('REMOVE_MENU', removedMenuId);
  },
};
