# 🚀 How to Access Web App and Mobile App

## ✅ Current Status

**Backend:** ✅ RUNNING on http://localhost:5000  
**Web App:** ✅ RUNNING on http://localhost:3000  
**Mobile App:** Starting...

---

## 🌐 Web App - OPEN NOW!

### Quick Access:
1. **Open your web browser**
2. **Go to:** http://localhost:3000
3. **Login with:**
   - Admin: `admin@example.com` / `admin123`
   - Customer: `kamal@example.com` / `customer123`
   - Provider: `ravi@example.com` / `provider123`

### Features Available:
- ✅ Admin Dashboard - Manage users, categories, services
- ✅ Customer Dashboard - Browse services, create bookings
- ✅ Provider Dashboard - View jobs, accept bookings, update status
- ✅ Map Integration - Select pickup/drop locations
- ✅ Route Optimization - See nearby parcels when accepting jobs

---

## 📱 Mobile App

### Step 1: Install Expo Go
- **iOS:** [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
- **Android:** [Google Play - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 2: Start Mobile App
```bash
cd mobile
npm start
```

### Step 3: Scan QR Code
- **iOS:** Open Camera app → Scan QR code
- **Android:** Open Expo Go app → Scan QR code
- **Or:** Press `s` in terminal to send link via SMS/email

### Step 4: View QR Code (if not visible)
```bash
# In terminal, run:
tail -f /tmp/mobile.log

# Or check the terminal where you ran npm start
```

### Important for Android:
Update `mobile/src/utils/api.js`:
```javascript
// Change localhost to your computer's IP:
const API_BASE_URL = 'http://192.168.1.XXX:5000/api';
```

Find your IP:
```bash
ipconfig getifaddr en0
```

---

## 🔧 Troubleshooting

### Web App Not Opening?
- Check if running: `lsof -ti:3000`
- Restart: `cd web && npm run dev`
- Check logs: `tail -f /tmp/web.log`

### Mobile App QR Code Not Showing?
- Check if running: `ps aux | grep expo`
- Restart: `cd mobile && npm start`
- Check logs: `tail -f /tmp/mobile.log`
- Make sure backend is running on port 5000

### Backend Not Running?
```bash
cd backend
npm run dev
```

---

## 📍 All Access Points

- **Backend API:** http://localhost:5000
- **Web App:** http://localhost:3000
- **API Health Check:** http://localhost:5000/api/health

---

## 🎯 Quick Commands

```bash
# Check all services
lsof -ti:5000 && echo "Backend: ✅" || echo "Backend: ❌"
lsof -ti:3000 && echo "Web: ✅" || echo "Web: ❌"

# View logs
tail -f /tmp/backend.log   # Backend
tail -f /tmp/web.log      # Web app
tail -f /tmp/mobile.log   # Mobile app

# Restart services
cd backend && npm run dev  # Backend
cd web && npm run dev      # Web
cd mobile && npm start     # Mobile
```

---

## ✨ Features to Try

1. **Admin:** Create categories and services
2. **Customer:** Browse services, create booking with map
3. **Provider:** Accept job, see nearby parcels on route
4. **Route Optimization:** When provider accepts a job, see other nearby parcels

Enjoy! 🎉

