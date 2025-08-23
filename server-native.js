const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Parse URL
    let parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = `./dist/ET-Easy-Travel${parsedUrl.pathname}`;
    
    // If no file extension, serve index.html (for SPA routing)
    if (!path.extname(pathname)) {
        pathname = './dist/ET-Easy-Travel/index.html';
    }
    
    // Read file
    fs.readFile(pathname, (err, data) => {
        if (err) {
            // If file not found, serve index.html for SPA routing
            if (err.code === 'ENOENT') {
                fs.readFile('./dist/ET-Easy-Travel/index.html', (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('File not found');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                });
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            // Get file extension and set content type
            const ext = path.extname(pathname).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
