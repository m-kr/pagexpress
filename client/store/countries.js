import { showRequestResult } from '@/utils';

export const state = () => ({
  countries: null,
});

export const mutations = {
  FETCH_COUNTRIES(state, countries) {
    state.countries = countries;
  },
};

export const actions = {
  async fetchCountries({ commit, dispatch }) {
    const countries = await showRequestResult({
      request: this.$axios.get('countries'),
      dispatch,
    });

    commit('FETCH_COUNTRIES', countries);
  },
};
