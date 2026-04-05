import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Attach Token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (e) {
        console.error('Err parsing auth-storage', e);
      }
    }
  }
  return config;
});

// RESPONSE INTERCEPTOR: Handle standardized { success, data, message }
api.interceptors.response.use(
  (response) => {
    // If backend returns { success: true, data: ... }
    if (response.data?.success) {
      return response.data; // Return only the data payload for cleaner UI usage
    }
    return response;
  },
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token and redirect if needed
      // localStorage.removeItem('auth-storage');
      // window.location.href = '/login';
    }
    
    // Pass back normalized error message
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ ...error, message });
  }
);

export default api;