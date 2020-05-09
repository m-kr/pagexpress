import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Navbar from '@/components/Navbar.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Navbar', () => {
  let getters;

  beforeEach(() => {
    getters = {
      isAuthenticated: jest.fn(),
    };
  });

  test('should display "Sign in" button when is not authenticated user', () => {
    const store = new Vuex.Store({
      getters,
    });
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: ['nuxt-link'],
    });

    const button = wrapper.find('.is-primary');
    expect(button.text()).toBe('Sign In');
  });

  test('should display logout button when user is authenticated', () => {
    const getters = {
      isAuthenticated: jest.fn(() => true),
    };
    const store = new Vuex.Store({
      getters,
    });
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: ['nuxt-link'],
    });

    const button = wrapper.find('button');
    expect(button.text()).toBe('Logout');
  });

  test('should call logout method after click on logout button', () => {
    const getters = {
      isAuthenticated: jest.fn(() => true),
    };
    const store = new Vuex.Store({
      getters,
    });
    const logoutFn = jest.fn();
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: ['nuxt-link'],
      methods: {
        logout: logoutFn,
      },
    });

    wrapper.find('button').trigger('click');
    expect(logoutFn).toHaveBeenCalledTimes(1);
  });

  test('should call logout auth module method', () => {
    const getters = {
      isAuthenticated: jest.fn(() => true),
    };
    const store = new Vuex.Store({
      getters,
    });
    const authLogoutFn = jest.fn();
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: ['nuxt-link'],
      mocks: {
        $auth: { logout: authLogoutFn },
      },
    });

    wrapper.find('button').trigger('click');
    expect(authLogoutFn).toHaveBeenCalledTimes(1);
  });
});
