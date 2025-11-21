# 🐛 Complete Debugging Guide for Mobile App

## 📱 Method 1: Chrome DevTools (Recommended)

### Step 1: Enable Remote Debugging

1. **Start the mobile app:**
   ```bash
   cd mobile
   npm start
   ```

2. **Open Expo Go on your phone** and connect to the app

3. **Enable Remote Debugging:**
   - **On iOS:** Shake your device (or press `Cmd+D` in simulator)
   - **On Android:** Shake device (or press `Cmd+M` / `Ctrl+M`)
   - Select **"Debug Remote JS"** from the menu

4. **Chrome DevTools will open automatically:**
   - If not, go to: `chrome://inspect` in Chrome
   - Click **"inspect"** under your device

### Step 2: Using Chrome DevTools

#### Console Tab
- See all `console.log()`, `console.error()`, etc.
- View JavaScript errors
- Execute JavaScript commands

#### Network Tab
- See all HTTP requests
- View request/response headers
- Check request payloads
- See response data
- Monitor API calls to backend

#### Sources Tab
- Set breakpoints
- Step through code
- Inspect variables
- Debug JavaScript execution

#### Application Tab
- View AsyncStorage data
- Check stored tokens
- Inspect local storage

---

## 📱 Method 2: Expo Dev Tools (Browser)

### Access Dev Tools:
1. Start app: `cd mobile && npm start`
2. Press **'m'** in terminal to open Expo Dev Tools
3. Or go to: http://localhost:19002

### Features:
- **Logs:** See console output
- **Metro Bundler:** View build status
- **Device:** See connected devices
- **QR Code:** Display QR code for connection

---

## 📱 Method 3: Terminal Logs

### Real-time Logs:
```bash
# All mobile logs
tail -f /tmp/mobile_*.log

# Specific log file
tail -f /tmp/mobile_sdk54.log

# Last 50 lines
tail -50 /tmp/mobile_*.log
```

### Metro Bundler Logs:
The terminal where you run `npm start` shows:
- Build errors
- Bundle status
- Network requests (if enabled)
- Console logs

---

## 🔍 Method 4: Network Request Debugging

### Enable Network Logging in Code:

Add this to `mobile/src/utils/api.js`:

```javascript
// Log all requests
api.interceptors.request.use((config) => {
  console.log('🌐 REQUEST:', {
    method: config.method.toUpperCase(),
    url: config.url,
    data: config.data,
    headers: config.headers
  });
  return config;
});

// Log all responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ RESPONSE:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ ERROR:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);
```

### View in Chrome DevTools:
1. Open Chrome DevTools (Method 1)
2. Go to **Network** tab
3. Filter by **XHR** or **Fetch**
4. Click any request to see details

---

## 🛠️ Method 5: React Native Debugger (Advanced)

### Install:
```bash
npm install -g react-native-debugger
```

### Use:
1. Start React Native Debugger app
2. Enable remote debugging in Expo Go
3. Debugger will connect automatically

---

## 📊 Method 6: Flipper (Advanced)

Flipper is Facebook's debugging platform:
- Network inspector
- Layout inspector
- Logs viewer
- Database inspector

**Note:** Requires additional setup for Expo projects.

---

## 🎯 Quick Debugging Checklist

### When Login Fails:

1. **Check Network Tab in Chrome:**
   - Is the request being sent?
   - What's the response status?
   - What's the error message?

2. **Check Console Tab:**
   - Any JavaScript errors?
   - Check `console.log()` output

3. **Check Application Tab:**
   - Is token being stored?
   - Check AsyncStorage values

4. **Check Backend:**
   ```bash
   tail -f /tmp/backend.log
   ```

5. **Test API Directly:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}'
   ```

---

## 🔧 Common Debugging Scenarios

### Scenario 1: Network Request Fails

**Check:**
1. Chrome DevTools → Network tab
2. Look for failed requests (red)
3. Check error message
4. Verify API URL is correct
5. Check if backend is running

### Scenario 2: Authentication Issues

**Check:**
1. Chrome DevTools → Application tab → AsyncStorage
2. Verify token is stored
3. Check token expiration
4. Verify token is sent in headers

### Scenario 3: App Crashes

**Check:**
1. Chrome DevTools → Console tab
2. Look for red error messages
3. Check stack trace
4. Terminal logs for native errors

### Scenario 4: UI Not Updating

**Check:**
1. Chrome DevTools → Console tab
2. Check for state update errors
3. Verify API responses
4. Check React DevTools (if installed)

---

## 📝 Debugging Tips

1. **Use console.log() strategically:**
   ```javascript
   console.log('🔍 Debug:', { variable1, variable2 });
   ```

2. **Use console.error() for errors:**
   ```javascript
   console.error('❌ Error:', error);
   ```

3. **Use console.table() for arrays:**
   ```javascript
   console.table(bookings);
   ```

4. **Network debugging:**
   - Always check Network tab first
   - Verify request payload
   - Check response status
   - Look for CORS errors

5. **State debugging:**
   - Use React DevTools extension
   - Check component props
   - Verify state updates

---

## 🚀 Quick Start Commands

```bash
# Start app with logging
cd mobile && npm start

# View backend logs
tail -f /tmp/backend.log

# View mobile logs
tail -f /tmp/mobile_*.log

# Test API
curl http://localhost:5000/api/health
```

---

## 📚 Additional Resources

- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Expo Debugging](https://docs.expo.dev/workflow/debugging/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

## ⚠️ Important Notes

1. **Remote debugging slows down the app** - disable when not needed
2. **Network requests are visible** - be careful with sensitive data
3. **Console logs are visible** - remove before production
4. **Make sure phone and computer are on same WiFi** for network debugging

