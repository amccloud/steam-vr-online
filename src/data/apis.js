import axios from 'axios';

const STEAM_API_KEY = process.env.STEAM_API_KEY;

export const steamApi = axios.create({
  baseURL: 'https://api.steampowered.com',
  timeout: 10000,
  params: {
    key: STEAM_API_KEY
  }
});

export const storeApi = axios.create({
  baseURL: 'http://store.steampowered.com/api',
  timeout: 10000
});
