import createApiService from './apiService.js';
import { BASE_URL } from './config.js';

const API_URL = `${BASE_URL}/api/user`;

const userService = createApiService(API_URL);
export default {
    getAll: userService.getAll,
    getById: userService.getById,
    add: userService.add,
    update: userService.update,
    delete: userService.delete
};
