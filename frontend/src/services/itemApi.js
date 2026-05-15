import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error.response?.data;
    let message =
      data?.message ||
      data?.title ||
      (typeof data === 'string' ? data : null) ||
      error.message ||
      'Something went wrong';

    if (data?.errors) {
      const validationMessages = Object.values(data.errors).flat();
      if (validationMessages.length) message = validationMessages.join(' ');
    }

    return Promise.reject(new Error(message));
  }
);

export const itemApi = {
  getStats: () => api.get('/items/stats'),
  getAll: (params = {}) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

export default itemApi;
