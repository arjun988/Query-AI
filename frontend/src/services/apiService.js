import axios from 'axios';
import AuthService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
    });

    // Interceptor to add auth token to requests
    this.api.interceptors.request.use(
      (config) => {
        const user = AuthService.getCurrentUser();
        if (user && user.access_token) {
          config.headers['Authorization'] = `Bearer ${user.access_token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor to handle token expiration
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired token
        if (error.response?.status === 401 && error.response?.data?.msg === 'Token has expired' && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Refresh the token
            const refreshedToken = await AuthService.refreshToken();
            AuthService.saveToken(refreshedToken); // Update token in storage

            // Retry the original request with the new token
            this.api.defaults.headers['Authorization'] = `Bearer ${refreshedToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${refreshedToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Handle refresh token failure (e.g., logout the user)
            AuthService.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Connect to a database
  async connectDatabase(connectionDetails) {
    try {
      const response = await this.api.post('/database/connect', connectionDetails);
      return response.data; // Return available tables or collections
    } catch (error) {
      throw error.response?.data || new Error('Database connection failed');
    }
  }

  // Execute queries on the database
  async executeQuery(queryDetails) {
    try {
      const response = await this.api.post('/query/execute', queryDetails);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Query execution failed');
    }
  }

  // Fetch saved database connections
  async getAvailableConnections() {
    try {
      const response = await this.api.get('/database/connections');
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Fetching connections failed');
    }
  }
}

export default new ApiService();
