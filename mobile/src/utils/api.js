import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from './getApiUrl.js';

// Dynamically get API URL - automatically detects IP from Expo dev server
// This handles router IP changes automatically
const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug: Log all requests (remove in production)
  if (__DEV__) {
    console.log('🌐 REQUEST:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers,
    });
  }
  
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => {
    // Debug: Log successful responses (remove in production)
    if (__DEV__) {
      console.log('✅ RESPONSE:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    // Debug: Log errors (remove in production)
    if (__DEV__) {
      console.error('❌ API ERROR:', {
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: error.message,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      
      // If network error, suggest checking IP
      if (error.message === 'Network Error' || error.code === 'ECONNREFUSED') {
        console.error('⚠️ Network connection failed!');
        console.error('💡 Possible solutions:');
        console.error('   1. Check if backend is running: curl http://localhost:5000/api/health');
        console.error('   2. Verify IP address in mobile/.env file');
        console.error('   3. Make sure phone and computer are on same WiFi');
        console.error(`   4. Current API URL: ${error.config?.baseURL}`);
      }
    }
    
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;

