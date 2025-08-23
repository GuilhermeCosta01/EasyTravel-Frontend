const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

console.log('🚀 EasyTravel Production Server - Starting...');
console.log(`📁 Working Directory: ${process.cwd()}`);

// MIME types for Angular assets
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Define possible base paths for Angular files
const angularPaths = [
    './dist/ET-Easy-Travel/browser',  // Full local structure
    './ET-Easy-Travel/browser',       // Without dist folder
    './browser',                      // Just browser folder
    '.'                               // Root directory
];

let workingAngularPath = null;

// Find the correct Angular path on startup
function findAngularPath() {
    for (const basePath of angularPaths) {
        const indexPath = path.join(basePath, 'index.html');
        if (fs.existsSync(indexPath)) {
            console.log(`✅ Found Angular files at: ${basePath}`);
            workingAngularPath = basePath;
            
            // Log some key files
            try {
                const files = fs.readdirSync(basePath);
                console.log(`📋 Angular files found:`, files.slice(0, 5).join(', '));
            } catch (e) {
                console.log(`Could not list files in ${basePath}`);
            }
            
            return true;
        }
    }
    console.log(`❌ Angular files not found in any expected location`);
    return false;
}

const server = http.createServer((req, res) => {
    console.log(`📥 ${req.method} ${req.url}`);
    
    // Parse URL and remove query parameters
    let filePath = req.url.split('?')[0];
    
    // Default to index.html for root requests
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    // If we haven't found the Angular path yet, try to find it
    if (!workingAngularPath) {
        findAngularPath();
    }
    
    // If we have a working Angular path, serve from there
    if (workingAngularPath) {
        const fullPath = path.join(workingAngularPath, filePath);
        
        try {
            if (fs.existsSync(fullPath)) {
                console.log(`✅ Serving: ${fullPath}`);
                
                const data = fs.readFileSync(fullPath);
                const ext = path.extname(fullPath).toLowerCase();
                const contentType = mimeTypes[ext] || 'application/octet-stream';
                
                res.writeHead(200, { 
                    'Content-Type': contentType,
                    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000'
                });
                res.end(data);
                return;
            }
        } catch (error) {
            console.log(`❌ Error reading ${fullPath}: ${error.message}`);
        }
        
        // If file not found and no extension (SPA route), serve index.html
        if (!path.extname(filePath)) {
            const indexPath = path.join(workingAngularPath, 'index.html');
            
            try {
                if (fs.existsSync(indexPath)) {
                    console.log(`🔄 SPA routing - serving index.html for ${filePath}`);
                    
                    const data = fs.readFileSync(indexPath);
                    res.writeHead(200, { 
                        'Content-Type': 'text/html',
                        'Cache-Control': 'no-cache'
                    });
                    res.end(data);
                    return;
                }
            } catch (error) {
                console.log(`❌ Error serving index.html for SPA: ${error.message}`);
            }
        }
    }
    
    // If we get here, file not found
    console.log(`❌ File not found: ${req.url}`);
    
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 - Not Found</title></head>
        <body>
            <h1>404 - File Not Found</h1>
            <p>The requested file <code>${req.url}</code> was not found.</p>
            <p>Angular path: <code>${workingAngularPath || 'Not found'}</code></p>
        </body>
        </html>
    `);
});

// Enhanced error handling
server.on('error', (err) => {
    console.log('❌ Server error:', err.message);
});

server.on('clientError', (err, socket) => {
    console.log('❌ Client error:', err.message);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

process.on('uncaughtException', (err) => {
    console.log('❌ Uncaught Exception:', err.message);
    // Don't exit, keep server running
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('❌ Unhandled Rejection:', reason);
    // Don't exit, keep server running
});

// Start server
server.listen(port, () => {
    console.log(`✅ EasyTravel Server started successfully on port ${port}`);
    console.log(`🌐 Ready to serve Angular application`);
    
    // Try to find Angular files on startup
    findAngularPath();
    
    if (workingAngularPath) {
        console.log(`🎯 Angular application will be served from: ${workingAngularPath}`);
    } else {
        console.log(`⚠️  Angular files not found - serving 404s until files are located`);
    }
});

// Minimal keepalive
setInterval(() => {
    console.log(`💓 Server running - Angular path: ${workingAngularPath || 'searching...'}`);
}, 120000); // Every 2 minutes
