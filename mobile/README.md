# Parcel Delivery Mobile App

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure you have Expo CLI installed globally:
```bash
npm install -g expo-cli
```

3. Update the API URL in `src/utils/api.js` if your backend is running on a different host/port.

4. Start the development server:
```bash
npm start
```

5. Scan the QR code with Expo Go app on your phone, or press `i` for iOS simulator, `a` for Android emulator.

## Features

### Customer App
- Browse services by category
- Create bookings with map location picker
- View booking history and track status

### Provider App
- View and accept pending jobs
- Update job status (On the way → Started → Completed)
- Navigate to locations using maps
- View assigned jobs

## Note

For Android, you may need to update the API URL to use your computer's local IP address instead of `localhost` (e.g., `http://192.168.1.100:5000/api`).

