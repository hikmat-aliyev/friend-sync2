import axios from 'axios';

const API_BASE = 'http://localhost:3000'

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/user/sign-in`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
  
      if (!data || !data.token) {
        throw new Error('Authentication failed');
      }
  
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.error('Error during authentication:', error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token')
  },

  getUserInfo: async (jwt) => {
    try {
      const response = await axios.post(
        `${API_BASE}/user`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const userData = response.data;
  
      if (!userData) {
        throw new Error('Failed to fetch user information');
      }
  
      return userData;
    } catch (error) {
      console.error('Error fetching user information:', error.message);
      throw error;
    }
  },

  signUp: async (firstName, lastName, email, birthDate, password) => {
    try {
      const response = await axios.post(`${API_BASE}/user/sign-up`, {
        firstName,
        lastName,
        birthDate,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
  
      if (!data || !data.token) {
        throw new Error('Authentication failed');
      }
  
      localStorage.setItem('token', data.token);
      const jwt = localStorage.getItem('token');
      console.log(jwt);
  
      return data;
    } catch (error) {
      console.error('Error during authentication:', error.message);
      throw error;
    }
  },

  googleSignIn: async (email) => {
    try {
      const response = await axios.post(`${API_BASE}/user/google/sign-in`, {
       email
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
      if (!data.token) {
        throw new Error('Authentication failed');
      }
  
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.error('Error during authentication:', error.message);
      throw error;
    }
  },

  googleSignUp: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE}/user/google/sign-up`, {
       userData
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
      console.log(data)
      if (!data.token) {
        console.log('no user')
        throw new Error('Authentication failed');
      }
  
      localStorage.setItem('token', data.token);
      const jwt = localStorage.getItem('token');
      console.log(`jwt: ${jwt}`);
  
      return data;
    } catch (error) {
      console.error('Error during authentication:', error.message);
      throw error;
    }
  },
}

export default AuthService;