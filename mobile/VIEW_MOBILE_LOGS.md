# 📱 How to View Mobile App Logs

## Method 1: Terminal Logs (Recommended)

### View Real-time Logs:
```bash
# All mobile logs
tail -f /tmp/mobile_*.log

# Specific log file
tail -f /tmp/mobile_sdk54.log
```

### View Last 50 Lines:
```bash
tail -50 /tmp/mobile_*.log
```

---

## Method 2: Expo Dev Tools

1. Start the mobile app: `cd mobile && npm start`
2. Press **'m'** in the terminal to open Expo Dev Tools in browser
3. Go to: http://localhost:19002
4. Click "Logs" tab to see all console logs

---

## Method 3: React Native Debugger

1. In Expo Go app on your phone:
   - Shake device (or Cmd+D on iOS simulator)
   - Select "Show Dev Menu"
   - Tap "Debug Remote JS"
2. Open Chrome DevTools:
   - Go to: chrome://inspect
   - Click "inspect" under your device
   - Go to "Console" tab

---

## Method 4: Terminal Where You Run `npm start`

The terminal where you run `npm start` shows all logs in real-time:
- Metro bundler logs
- Build errors
- Network requests
- Console.log() output

---

## 🔍 Common Log Messages

### Login Failed:
```
POST http://192.168.1.33:5000/api/auth/login
Error: Network request failed
```
**Fix:** Check if backend is running and phone is on same WiFi

### API Connection Error:
```
Error: connect ECONNREFUSED 192.168.1.33:5000
```
**Fix:** 
1. Check backend is running: `lsof -ti:5000`
2. Check firewall allows port 5000
3. Verify IP address is correct

### Authentication Error:
```
401 Unauthorized
```
**Fix:** 
1. Check credentials are correct
2. Make sure database is seeded: `cd backend && npm run seed`

---

## 🐛 Debugging Steps

1. **Check Backend:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check Mobile API URL:**
   - Open `mobile/src/utils/api.js`
   - Verify IP address matches your computer's IP
   - Get your IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)

3. **View Logs:**
   ```bash
   # Backend logs
   tail -f /tmp/backend.log
   
   # Mobile logs
   tail -f /tmp/mobile_*.log
   ```

4. **Test Login API:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}'
   ```

---

## 📝 Notes

- Logs are saved to `/tmp/mobile_*.log` when running in background
- If running `npm start` in foreground, logs appear directly in terminal
- Make sure phone and computer are on same WiFi network
- Use your computer's IP address, not `localhost` in mobile app

