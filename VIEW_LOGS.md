# 📋 How to View App Logs

## 🔍 Backend Logs

### View Backend Logs:
```bash
# Real-time logs
tail -f /tmp/backend.log

# Last 50 lines
tail -50 /tmp/backend.log

# Or if backend is running in terminal, check that terminal
```

### Test Backend API:
```bash
# Health check
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

---

## 📱 Mobile App Logs

### View Mobile Logs:
```bash
# Real-time logs
tail -f /tmp/mobile_*.log

# Or check the terminal where you ran 'npm start'
```

### In Expo Go App:
- Open Expo Go on your phone
- Shake your device (or press Cmd+D on iOS simulator)
- Select "Show Dev Menu"
- Tap "Debug Remote JS"
- Open Chrome DevTools to see console logs

---

## 🌐 Web App Logs

### View Web App Logs:
```bash
# Real-time logs
tail -f /tmp/web.log

# Or check browser console:
# 1. Open http://localhost:3000
# 2. Press F12 (or Cmd+Option+I on Mac)
# 3. Go to "Console" tab
```

---

## 🐛 Common Login Issues

### Issue 1: Backend Not Running
**Solution:**
```bash
cd backend
npm run dev
```

### Issue 2: Database Not Seeded
**Solution:**
```bash
cd backend
npm run seed
```

### Issue 3: Wrong API URL (Mobile)
**Check:** `mobile/src/utils/api.js`
- For Android: Use your computer's IP instead of localhost
- Example: `http://192.168.1.100:5000/api`

### Issue 4: Network Connection
- Make sure phone and computer are on same WiFi
- Check firewall allows port 5000

---

## 🔧 Debug Steps

1. **Check Backend:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check Database:**
   ```bash
   cd backend
   npm run seed  # Creates test users
   ```

3. **Check Mobile API URL:**
   - Open `mobile/src/utils/api.js`
   - Make sure URL is correct for your network

4. **View All Logs:**
   ```bash
   # Backend
   tail -f /tmp/backend.log
   
   # Mobile (in another terminal)
   tail -f /tmp/mobile_*.log
   ```

---

## 📞 Quick Fixes

**If login fails:**
1. Make sure backend is running: `lsof -ti:5000`
2. Seed database: `cd backend && npm run seed`
3. Check API URL in mobile app
4. Check network connection

