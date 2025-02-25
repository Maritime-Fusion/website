# Maritime Fusion Website Preview Server

This README provides instructions on how to use the local server options to preview your website.

## Option 1: Python Live Reload Server (Recommended)

### Requirements
- Python 3.x installed on your system

### Steps to Run
1. Open your terminal/command prompt
2. Navigate to the website directory
3. Run the following command:
   ```
   python live_server.py
   ```
4. The server will start and automatically open your default browser to http://localhost:8000
5. Make changes to your HTML, CSS, or JS files, and the browser will automatically refresh
6. Press Ctrl+C in the terminal to stop the server when done

### First-time Setup
The script will automatically try to install the required `livereload` package if needed. If installation fails, you can install it manually:
```
pip install livereload
```

## Option 2: Node.js Live Reload Server (Alternative)

### Requirements
- Node.js and npm installed on your system

### Steps to Run
1. Open your terminal/command prompt
2. Navigate to the website directory
3. Install dependencies (first time only):
   ```
   npm install
   ```
4. Start the live reload server:
   ```
   npm run dev
   ```
5. The server will start and automatically open your default browser to http://localhost:3000
6. Make changes to your HTML, CSS, or JS files, and the browser will automatically refresh
7. Press Ctrl+C in the terminal to stop the server when done

## Static Servers (No Auto-refresh)

If you don't need the auto-refresh functionality, you can still use the static servers:

### Python Static Server
```
python server.py
```

### Node.js Static Server
```
npm start
```

## Which Option Should I Use?

- Use the **Python Live Reload Server** if you just want a simple solution and have Python installed.
- Use the **Node.js Live Reload Server** if you're more comfortable with JavaScript or need more advanced features.

Both live reload servers will automatically refresh the browser when you make changes to your files. 