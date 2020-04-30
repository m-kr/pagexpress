import {
  LOGIN_SUCCESS,
  LOGOUT,
  REQUEST_ERROR,
  REQUEST_PENDING,
  REQUEST_SUCCESS,
} from './action-types';
import restApiRequest from '@/restApiRequest';

const initialState = {
  loggedIn: !!localStorage.getItem('token'),
  userEmail: null,
};

const mutations = {
  [LOGIN_SUCCESS](state, { email }) {
    state.loggedIn = true;
    state.userEmail = email;
  },
  [LOGOUT](state) {
    state.userData = initialState.userData;
    state.loggedIn = initialState.loggedIn;
  },
};

const actions = {
  login({ commit, state }, authData) {
    if (state.login) {
      return;
    }

    commit(REQUEST_PENDING, null, { root: true });

    restApiRequest({
      collection: 'auth',
      actionType: 'create',
      data: authData,
    })
      .then(token => {
        commit(REQUEST_SUCCESS, null, { root: true });

        commit(LOGIN_SUCCESS, {
          token,
          email: authData.email,
        });

        localStorage.setItem('token', token);
        this.app.router.push('/');
      })
      .catch(err => {
        // eslint-disable-next-line
        console.error(err);

        commit(REQUEST_ERROR, err, { root: true });
      });
  },
  logout({ commit }) {
    localStorage.removeItem('token');

    commit({
      type: LOGOUT,
    });
    this.app.router.push('login');
  },
};

export default {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
};
