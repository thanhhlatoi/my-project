import { BASE_URL } from './config.js';
import createApiService from './apiService.js';
const API_URL = `${BASE_URL}/api/performer`;

const performerService = createApiService(API_URL);
export default {
    getAll: performerService.getAll,
    getById: performerService.getById,
    add: performerService.add,
    update: performerService.update,
    delete: performerService.delete
};
