# 📱 How to See the QR Code

## ✅ Easiest Method (Recommended)

**Open a NEW terminal window** and run these commands:

```bash
cd '/Users/jkarunarathna/Desktop/Post App/mobile'
npm start
```

**The QR code will appear directly in that terminal window** as ASCII art!

---

## 🔍 Alternative Methods

### Method 1: Press 'm' Key
After running `npm start`, press the **'m'** key in the terminal. This opens Expo Dev Tools in your browser at `http://localhost:19002` where you'll see the QR code.

### Method 2: Open Expo Dev Tools Manually
1. Run `npm start` in mobile directory
2. Open browser and go to: `http://localhost:19002`
3. QR code will be displayed there

### Method 3: Manual Connection (No QR Code Needed)
1. Open **Expo Go** app on your phone
2. Tap **"Enter URL manually"**
3. Get your computer's IP address:
   ```bash
   ipconfig getifaddr en0
   ```
4. Type in Expo Go: `expo://YOUR_IP:8081`
   Example: `expo://192.168.1.100:8081`

---

## ⚠️ Important Notes

- **QR code only appears in the terminal** where you run `npm start`
- It won't show in background processes or log files
- Make sure your phone and computer are on the **same WiFi network**
- For Android, you may need to use your computer's IP instead of localhost

---

## 🚀 Quick Start

Just run this in a terminal:
```bash
cd '/Users/jkarunarathna/Desktop/Post App/mobile'
npm start
```

Then look at the terminal output - the QR code will appear there! 📱

