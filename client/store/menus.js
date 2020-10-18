import {
  enrichById,
  formatRequestError,
  reorderItems,
  updateItemChildren,
} from '@/utils';

export const state = () => ({
  menus: [],
});

export const mutations = {
  FETCH_MENUS(state, menus) {
    state.menus = menus;
  },

  UPDATE_MENU(state, { menuId, menuData }) {
    const newMenus = [];

    for (const menu of state.menus) {
      if (menu._id === menuId) {
        newMenus.push(menuData);
      } else {
        newMenus.push(menu);
      }
    }

    state.menus = newMenus;
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

  REMOVE_MENU(state, menuId) {
    state.menus = state.menus.filter(menu => menu._id !== menuId);
  },
};

export const actions = {
  async fetchMenus({ commit }) {
    const { data } = await this.$axios.get('menus');

    return commit(
      'FETCH_MENUS',
      data.map(menu => ({
        ...menu,
        items: enrichById(menu.items, 'children'),
      }))
    );
  },

  async updateMenu({ commit, state }, { menuId, dragResults, parentItemId }) {
    const { data } = await this.$axios.put(`menus/${menuId}`);

    return commit('UPDATE_MENU', {
      menuId,
      data,
    });
  },

  async removeMenus({ commit, dispatch }, menuId) {
    if (!confirm('Please, confirm removing menu')) {
      return;
    }

    const { data } = await this.$axios.delete(`menus/${menuId}`).catch(
      error =>
        dispatch('notifications/error', formatRequestError(error), {
          root: true,
        }),
      { root: true }
    );

    if (data) {
      commit('REMOVE_MENU', menuId);
      dispatch('notifications/success', 'Removed page', { root: true });

      return true;
    } else {
      dispatch(
        'notifications/error',
        'Unknown error: Page can not be removed',
        {
          root: true,
        }
      );
    }
  },
};
