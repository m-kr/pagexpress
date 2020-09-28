import axios from 'axios';

export default axios.create({
  baseURL: process.env.API_URL,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});
