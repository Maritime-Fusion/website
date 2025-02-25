const browserSync = require('browser-sync').create();
const path = require('path');

// Configure browser-sync
browserSync.init({
    server: {
        baseDir: './',
        index: 'index.html'
    },
    port: 3000,
    open: true,
    notify: true,
    ui: false,
    files: [
        '*.html',
        '*.css',
        '*.js',
        '*.png',
        '*.jpg',
        '*.jpeg',
        '*.gif',
        '*.svg',
        '*.mp4',
        '*.webm'
    ]
});

console.log('Live reload server running at http://localhost:3000');
console.log('The page will automatically refresh when you make changes to your files.');
console.log('Press Ctrl+C to stop the server.'); 