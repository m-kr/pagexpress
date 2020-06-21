export const state = () => ({
  countries: null,
});

export const mutations = {
  FETCH_COUNTRIES(state, countries) {
    state.countries = countries;
  },
};

export const actions = {
  async fetchCountries({ commit }) {
    const { data } = await this.$axios.get('countries');
    return commit('FETCH_COUNTRIES', data);
  },
};
