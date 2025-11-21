# How to Open Web App and Mobile App

## 🌐 Web App

### Option 1: Using Browser (Recommended)

1. **Start the backend** (if not already running):
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the web app**:
   ```bash
   cd web
   npm run dev
   ```

3. **Open in browser**:
   - The terminal will show: `Local: http://localhost:3000`
   - Open your browser and go to: **http://localhost:3000**

### Option 2: Using Startup Script

```bash
./start.sh
```

Then open: **http://localhost:3000**

### Troubleshooting Web App

If you get a Node.js version error:
- **Update Node.js** to v20 or later:
  ```bash
  # Using nvm
  nvm install 20
  nvm use 20
  
  # Or download from nodejs.org
  ```

---

## 📱 Mobile App

### Prerequisites

1. **Install Expo Go** on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Make sure backend is running** on port 5000

### Option 1: Using Expo Go (Physical Device)

1. **Start the mobile app**:
   ```bash
   cd mobile
   npm install  # First time only
   npm start
   ```

2. **Scan QR Code**:
   - **iOS**: Open Camera app and scan the QR code
   - **Android**: Open Expo Go app and scan the QR code
   - Or press `s` in terminal to send link via SMS/email

3. **The app will open** in Expo Go on your phone

### Option 2: Using Simulator/Emulator

**For iOS Simulator** (Mac only):
```bash
cd mobile
npm start
# Press 'i' in terminal to open iOS simulator
```

**For Android Emulator**:
```bash
cd mobile
npm start
# Press 'a' in terminal to open Android emulator
```

### Option 3: Using Startup Script

```bash
./start-mobile.sh
```

### Important Notes for Mobile App

1. **API URL Configuration**:
   - For **Android physical device**: Update `mobile/src/utils/api.js`
   - Change `localhost` to your computer's IP address:
     ```javascript
     const API_BASE_URL = 'http://192.168.1.XXX:5000/api';
     ```
   - Find your IP: 
     ```bash
     # Mac/Linux
     ifconfig | grep "inet " | grep -v 127.0.0.1
     
     # Or
     ipconfig getifaddr en0
     ```

2. **Same Network**: Your phone and computer must be on the same WiFi network

---

## 🚀 Quick Start (All Services)

### Start Everything at Once:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Web App
cd web
npm run dev

# Terminal 3: Mobile App
cd mobile
npm start
```

### Or Use Startup Scripts:

```bash
# Start backend + web
./start.sh

# In another terminal, start mobile
./start-mobile.sh
```

---

## 📍 Access Points

- **Backend API**: http://localhost:5000
- **Web App**: http://localhost:3000
- **Mobile App**: Scan QR code with Expo Go

---

## 👤 Login Credentials

After seeding database (`npm run seed` in backend):

- **Admin**: admin@example.com / admin123
- **Customer**: kamal@example.com / customer123
- **Provider**: ravi@example.com / provider123

---

## 🔧 Troubleshooting

### Web App Won't Start
- **Node.js version**: Update to v20+
- **Port 3000 in use**: Kill process: `lsof -ti:3000 | xargs kill -9`

### Mobile App Can't Connect
- **Check backend is running**: `curl http://localhost:5000/api/health`
- **Update API URL**: Use your computer's IP instead of localhost
- **Same WiFi**: Phone and computer must be on same network
- **Firewall**: Allow connections on port 5000

### Backend Won't Start
- **MySQL not running**: Start MySQL service
- **Wrong port**: Check `.env` file has `DB_PORT=3306`
- **Database connection**: Verify MySQL credentials in `.env`

