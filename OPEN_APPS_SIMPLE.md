# 🚀 How to Open the Apps - Simple Guide

## 🌐 Web App (Easiest Way)

### Just 2 Steps:

1. **Open your web browser** (Chrome, Safari, Firefox, etc.)

2. **Type this address and press Enter:**
   ```
   http://localhost:3000
   ```

**That's it!** The app will open in your browser.

### Login Credentials:
- **Admin:** admin@example.com / admin123
- **Customer:** kamal@example.com / customer123  
- **Provider:** ravi@example.com / provider123

---

## 📱 Mobile App

### Step 1: Install Expo Go
- **iPhone:** Open App Store → Search "Expo Go" → Install
- **Android:** Open Play Store → Search "Expo Go" → Install

### Step 2: Start Mobile App
Open terminal and run:
```bash
cd mobile
npm start
```

### Step 3: Scan QR Code
- **iPhone:** Open Camera app → Point at QR code → Tap notification
- **Android:** Open Expo Go app → Tap "Scan QR code" → Scan

---

## ✅ Quick Check

**Is everything running?**
```bash
# Check backend
curl http://localhost:5000/api/health

# Check web app
# Just open: http://localhost:3000
```

**If web app doesn't open:**
```bash
cd web
npm run dev
```

**If mobile app doesn't start:**
```bash
cd mobile
npm install
npm start
```

---

## 🎯 That's It!

- **Web:** http://localhost:3000 ← Open this now!
- **Mobile:** Scan QR code from `npm start` output

Enjoy! 🎉

