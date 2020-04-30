import {
  REQUEST_ERROR,
  REQUEST_PENDING,
  REQUEST_SUCCESS,
  CLEAR_ERRORS,
} from './action-types';

const initialState = {
  loading: false,
  errors: null,
};

const mutations = {
  [REQUEST_SUCCESS](state) {
    state = { ...state, initialState };
  },
  [REQUEST_PENDING](state) {
    state.loading = true;
  },
  [REQUEST_ERROR](state, error) {
    state.loading = false;
    state.errors = state.errors ? [...state.errors, error] : [error];
  },
  [CLEAR_ERRORS](state) {
    state.errors = null;
  },
};

const actions = {
  clearErrors({ commit }) {
    commit(CLEAR_ERRORS);
  },
};

export default {
  state: initialState,
  mutations,
  actions,
};
