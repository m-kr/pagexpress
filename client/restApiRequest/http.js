import axios from 'axios';

const http = axios.create({
  baseURL: process.env.api_url,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use(
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
