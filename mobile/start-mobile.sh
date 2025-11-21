#!/bin/bash

# Mobile app startup script with automatic IP detection

cd "$(dirname "$0")"

echo "📱 Starting Mobile App..."
echo ""

# Get current IP address
get_ip() {
    # Try different methods to get IP
    if command -v ipconfig >/dev/null 2>&1; then
        # macOS
        ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null
    elif command -v ifconfig >/dev/null 2>&1; then
        # Linux/macOS fallback
        ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
    elif command -v hostname >/dev/null 2>&1; then
        # Alternative method
        hostname -I 2>/dev/null | awk '{print $1}'
    fi
}

# Detect IP and update .env if needed
CURRENT_IP=$(get_ip)
if [ -n "$CURRENT_IP" ]; then
    echo "🌐 Detected IP address: $CURRENT_IP"
    
    # Create or update .env file
    if [ ! -f ".env" ]; then
        echo "EXPO_PUBLIC_API_URL=http://${CURRENT_IP}:5000/api" > .env
        echo "✅ Created .env file with detected IP: $CURRENT_IP"
    else
        # Check if IP changed
        OLD_IP=$(grep "EXPO_PUBLIC_API_URL" .env 2>/dev/null | sed 's/.*http:\/\///' | sed 's/:5000.*//')
        if [ "$OLD_IP" != "$CURRENT_IP" ]; then
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=http://${CURRENT_IP}:5000/api|" .env
            else
                # Linux
                sed -i "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=http://${CURRENT_IP}:5000/api|" .env
            fi
            echo "✅ Updated .env file with new IP: $CURRENT_IP"
        else
            echo "✅ IP address unchanged: $CURRENT_IP"
        fi
    fi
    echo "📡 API URL set to: http://${CURRENT_IP}:5000/api"
else
    echo "⚠️  Could not detect IP address automatically"
    echo "💡 You can manually set it in mobile/.env file:"
    echo "   EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api"
    echo ""
    echo "To find your IP, run:"
    echo "   ipconfig getifaddr en0  (macOS)"
    echo "   hostname -I | awk '{print \$1}'  (Linux)"
fi

echo ""

# Kill any existing Expo processes
pkill -f "expo" 2>/dev/null
sleep 2

# Start Expo
echo "🚀 Starting Expo development server..."
echo "⏳ Please wait for QR code to appear..."
echo ""

npx expo start

