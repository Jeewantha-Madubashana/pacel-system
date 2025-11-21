import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Dynamically get the API URL based on the current environment
 * This handles router IP changes by detecting the IP from Expo's dev server
 */
const getApiUrl = () => {
  // 1. Check environment variable first (can be set in .env or app.json)
  if (process.env.EXPO_PUBLIC_API_URL && process.env.EXPO_PUBLIC_API_URL.trim() !== '') {
    console.log(`🌐 Using API URL from environment: ${process.env.EXPO_PUBLIC_API_URL}`);
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. For development, try to extract IP from Expo's dev server
  if (__DEV__) {
    try {
      // Method 1: Try to get from manifest debuggerHost (most reliable)
      const debuggerHost = Constants.manifest?.debuggerHost || 
                          Constants.manifest2?.extra?.expoGo?.debuggerHost ||
                          Constants.expoConfig?.extra?.debuggerHost;

      if (debuggerHost) {
        // Extract IP from "192.168.1.33:8081" or "localhost:8081"
        const ipMatch = debuggerHost.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (ipMatch && ipMatch[1]) {
          const ip = ipMatch[1];
          const apiUrl = `http://${ip}:5000/api`;
          console.log(`🌐 ✅ Auto-detected IP from Expo: ${ip} -> ${apiUrl}`);
          return apiUrl;
        }
        
        // If localhost, we need to use the actual IP for physical devices
        if (debuggerHost.includes('localhost') || debuggerHost.includes('127.0.0.1')) {
          console.warn('⚠️ Expo is using localhost. This won\'t work on physical devices.');
          console.warn('💡 Please set EXPO_PUBLIC_API_URL in mobile/.env file');
          console.warn('   Or use the startup script: ./mobile/start-mobile.sh');
        }
      }

      // Method 2: Try Constants.expoConfig.extra
      const extra = Constants.expoConfig?.extra;
      if (extra?.apiUrl) {
        console.log(`🌐 Using API URL from expo config: ${extra.apiUrl}`);
        return extra.apiUrl;
      }

      // Method 3: Try to extract from expo:// URL if available
      const expoUrl = Constants.expoConfig?.extra?.expoUrl;
      if (expoUrl) {
        const ipMatch = expoUrl.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (ipMatch && ipMatch[1]) {
          const ip = ipMatch[1];
          const apiUrl = `http://${ip}:5000/api`;
          console.log(`🌐 ✅ Auto-detected IP from Expo URL: ${ip} -> ${apiUrl}`);
          return apiUrl;
        }
      }

      // Method 4: Try to get from Metro bundler connection
      // This is available when connected via Expo Go
      const metroHost = Constants.expoConfig?.hostUri;
      if (metroHost) {
        const ipMatch = metroHost.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (ipMatch && ipMatch[1]) {
          const ip = ipMatch[1];
          const apiUrl = `http://${ip}:5000/api`;
          console.log(`🌐 ✅ Auto-detected IP from Metro: ${ip} -> ${apiUrl}`);
          return apiUrl;
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not detect IP from Expo:', error.message);
    }

    // 3. For physical devices, localhost won't work - need actual IP
    if (Platform.OS !== 'web') {
      console.error('❌ Could not auto-detect IP address!');
      console.error('💡 Solutions:');
      console.error('   1. Create mobile/.env file with:');
      console.error('      EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api');
      console.error('   2. Use startup script: ./mobile/start-mobile.sh');
      console.error('   3. Get your IP: ipconfig getifaddr en0');
      // Don't return localhost for physical devices - it won't work
      // Return a placeholder that will cause an error so user knows to configure it
      return 'http://YOUR_IP_HERE:5000/api';
    }
  }

  // 4. Production fallback (for web or simulator)
  return 'http://localhost:5000/api';
};

/**
 * Get API base URL with automatic IP detection
 * This function is called once and cached
 */
let cachedApiUrl = null;

export const getApiBaseUrl = () => {
  if (cachedApiUrl) {
    return cachedApiUrl;
  }

  cachedApiUrl = getApiUrl();
  console.log(`📡 API Base URL: ${cachedApiUrl}`);
  return cachedApiUrl;
};

/**
 * Reset cached URL (useful when IP changes)
 */
export const resetApiUrl = () => {
  cachedApiUrl = null;
};

export default getApiBaseUrl;

