import { BASE_URL } from "./config.js";
import createApiService from './apiService.js';

const API_URL = `${BASE_URL}/api/category`;

const categoryService = createApiService(API_URL);
export default {
    getAll: categoryService.getAll,
    getById: categoryService.getById,
    add: categoryService.add,
    update: categoryService.update,
    delete: categoryService.delete
};
