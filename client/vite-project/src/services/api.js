import axios from 'axios';

const API_URL = 'http://localhost:3000/todo';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => apiClient.post('/signup', data),
  login: (data) => apiClient.post('/login', data),
  sendOTP: (data) => apiClient.post('/send-otp', data),
  verifyOTPSignup: (data) => apiClient.post('/verify-otp-signup', data),
  verifyOTPLogin: (data) => apiClient.post('/verify-otp-login', data),
};

// Todo APIs (User)
export const todoAPI = {
  createTodo: (data) => apiClient.post('/create-todo', data),
  getTodos: (userId) => apiClient.get(`/get-todo/${userId}`),
  updateTodo: (id, data) => apiClient.patch(`/update-todo/${id}`, data),
  deleteTodo: (id) => apiClient.delete(`/delete-todo/${id}`),
};

// Admin APIs
export const adminAPI = {
  getPendingTodos: () => apiClient.get('/pending-todo'),
  getRejectedTodos: () => apiClient.get('/rejected-todo'),
  getAllTodos: () => apiClient.get('/get-all'),
  getTodoById: (id) => apiClient.get(`/get-todobyId?id=${id}`),
  approveTodo: (id) => apiClient.patch(`/approve/${id}`),
  rejectTodo: (id) => apiClient.patch(`/reject/${id}`),
};

export default apiClient;
