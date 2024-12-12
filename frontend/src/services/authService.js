import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
    async login(email, password) {
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, password });
          
          if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
          }
          
          return response.data;
        } catch (error) {
          console.error('Login error:', error.response ? error.response.data : error);
          throw error.response ? error.response.data : new Error('Login failed');
        }
      }
      
      async signup(username, email, password) {
        try {
          const response = await axios.post(`${API_URL}/auth/signup`, { username, email, password });
          
          if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
          }
          
          return response.data;
        } catch (error) {
          console.error('Signup error:', error.response ? error.response.data : error);
          throw error.response ? error.response.data : new Error('Signup failed');
        }
      }
      

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user && !!user.access_token;
  }
}

// Assign the instance to a variable before exporting
const authServiceInstance = new AuthService();
export default authServiceInstance;
