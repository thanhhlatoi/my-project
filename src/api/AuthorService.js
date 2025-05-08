import { BASE_URL } from './config.js';
import createApiService from './apiService.js';

const API_URL = `${BASE_URL}/api/author`;
const authorService = createApiService(API_URL);

export default {
    getAll: authorService.getAll,
    getById: authorService.getById,
    add: authorService.add,
    update: authorService.update,
    delete: authorService.delete
};
