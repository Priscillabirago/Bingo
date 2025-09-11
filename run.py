#!/usr/bin/env python3
"""
Simple launcher script for Bingo Master
"""
import os
import sys
from app import app

if __name__ == '__main__':
    print("🎯 Starting Bingo Master...")
    print("🌐 Open your browser and navigate to: http://localhost:5000")
    print("🎮 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped. Thanks for playing Bingo Master!")
        sys.exit(0)
