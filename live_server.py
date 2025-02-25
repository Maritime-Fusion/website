#!/usr/bin/env python3
import os
import sys
import webbrowser
from threading import Timer

# Check if livereload is installed
try:
    from livereload import Server
except ImportError:
    print("The 'livereload' package is required for live reloading.")
    print("Installing it now...")
    import subprocess
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "livereload"])
        from livereload import Server
    except Exception as e:
        print(f"Error installing livereload: {e}")
        print("Please install it manually with: pip install livereload")
        sys.exit(1)

# Configuration
PORT = 8000
ROOT_DIR = os.path.abspath(os.path.dirname(__file__))

def open_browser():
    """Open browser after a short delay"""
    webbrowser.open(f"http://localhost:{PORT}")

# Initialize server
server = Server()

# Watch for changes in specific file types
server.watch('*.html')
server.watch('*.css')
server.watch('*.js')
server.watch('*.png')
server.watch('*.jpg')
server.watch('*.jpeg')
server.watch('*.gif')
server.watch('*.svg')
server.watch('*.mp4')
server.watch('*.webm')

# Set the root directory to serve files from
server.serve(root=ROOT_DIR, port=PORT, liveport=35729, host='localhost')

# Open browser after a short delay (to ensure server is running)
Timer(1.0, open_browser).start()

print(f"Live reload server running at http://localhost:{PORT}")
print("The page will automatically refresh when you make changes to your files.")
print("Press Ctrl+C to stop the server.") 