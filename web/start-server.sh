#!/bin/bash

# Simple HTTP server launcher for the Vibhuti Yoga website
# This script will start a local web server to preview the site

echo "🕉️  Starting Vibhuti Yoga Sacred Seva Website..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "✅ Python3 found"
    echo "🌐 Server starting at: http://localhost:8000"
    echo "📂 Serving from: $(pwd)"
    echo ""
    echo "Press CTRL+C to stop the server"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Python found"
    echo "🌐 Server starting at: http://localhost:8000"
    echo "📂 Serving from: $(pwd)"
    echo ""
    echo "Press CTRL+C to stop the server"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python not found. Please install Python to run the local server."
    echo "   Alternatively, you can:"
    echo "   - Use 'npx serve' if you have Node.js installed"
    echo "   - Open index.html directly in your browser"
    exit 1
fi
