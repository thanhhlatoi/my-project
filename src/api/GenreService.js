import { BASE_URL } from "./config.js";
import createApiService from './apiService.js';

const API_URL = `${BASE_URL}/api/genre`;

const genreService = createApiService(API_URL);
export default {
  getAll: genreService.getAll,
  getById: genreService.getById,
  add: genreService.add,
  update: genreService.update,
  delete: genreService.delete
};

