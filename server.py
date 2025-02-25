#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
from pathlib import Path

# Define port
PORT = 8000

# Set up handler
Handler = http.server.SimpleHTTPRequestHandler

# Create server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    # Print server info
    print(f"Server started at http://localhost:{PORT}")
    
    # Open browser automatically
    webbrowser.open(f"http://localhost:{PORT}")
    
    # Keep server running
    print("Press Ctrl+C to stop the server.")
    httpd.serve_forever() 