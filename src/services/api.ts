import axios from 'axios';

import config from '../config';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add axios interceptor for handling token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginApi = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    const accessToken = response.data.accessToken;
    
    // Store the token
    localStorage.setItem('token', accessToken);
    
    // Parse the token to get user info
    const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
    localStorage.setItem('user', JSON.stringify(tokenData));
    return {
      accessToken,
      user: {
        id: tokenData.id,
        email: tokenData.email,
        role: tokenData.role.toLowerCase(),
        name: tokenData.name,
        exp: tokenData.exp,
        iat: tokenData.iat
      }
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to login. Please try again.');
  }
};

export const verifyEmail = async (email: string) => {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/auth/reset/verify-email`, {
      email
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const forgotPasswordApi = async (email: string) => {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/auth/reset/forgot-password`, {
      email
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logoutApi = async () => {
  try {
    await axios.post(`${config.API_BASE_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const refreshTokenApi = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${config.API_BASE_URL}/auth/refresh-token`, {
      refreshToken
    });

    const { accessToken, newRefreshToken } = response.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

export default api;