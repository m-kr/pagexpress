import axios from '../plugins/axios';

const http = axios.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default http;
