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
    console.log(`=== REQUEST DEBUG ===`);
    console.log(`${req.method} ${req.url}`);
    console.log(`Host: ${req.headers.host}`);
    console.log(`User-Agent: ${req.headers['user-agent']}`);
    
    // Parse URL
    let parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = `./dist/ET-Easy-Travel${parsedUrl.pathname}`;
    
    console.log(`=== PATH DEBUG ===`);
    console.log(`Original URL: ${req.url}`);
    console.log(`Parsed pathname: ${parsedUrl.pathname}`);
    console.log(`Final path: ${pathname}`);
    
    // If no file extension, serve index.html (for SPA routing)
    if (!path.extname(pathname)) {
        pathname = './dist/ET-Easy-Travel/index.html';
        console.log(`No extension detected, using: ${pathname}`);
    }
    
    console.log(`=== FILE SYSTEM DEBUG ===`);
    console.log(`Current working directory: ${process.cwd()}`);
    
    // List directory structure first
    try {
        const rootFiles = fs.readdirSync('.');
        console.log(`Root directory contents:`, rootFiles);
        
        if (rootFiles.includes('dist')) {
            console.log(`Found dist directory!`);
            const distFiles = fs.readdirSync('./dist');
            console.log(`Dist directory contents:`, distFiles);
            
            if (distFiles.includes('ET-Easy-Travel')) {
                console.log(`Found ET-Easy-Travel directory!`);
                const appFiles = fs.readdirSync('./dist/ET-Easy-Travel');
                console.log(`ET-Easy-Travel directory contents:`, appFiles);
            }
        }
    } catch (e) {
        console.log(`Error listing directories:`, e.message);
    }
    
    console.log(`=== ATTEMPTING TO SERVE ===`);
    console.log(`Trying to serve: ${pathname}`);
    
    // Read file
    fs.readFile(pathname, (err, data) => {
        if (err) {
            console.log(`=== ERROR READING FILE ===`);
            console.log(`Error reading ${pathname}:`, err.message);
            console.log(`Error code: ${err.code}`);
            
            // If file not found, serve index.html for SPA routing
            if (err.code === 'ENOENT') {
                console.log(`=== TRYING FALLBACK TO INDEX.HTML ===`);
                console.log('File not found, trying to serve index.html as fallback');
                
                fs.readFile('./dist/ET-Easy-Travel/index.html', (err, data) => {
                    if (err) {
                        console.log(`=== INDEX.HTML ALSO FAILED ===`);
                        console.log('Error reading index.html:', err.message);
                        console.log('Error code:', err.code);
                        
                        // Let's try different paths
                        console.log(`=== TRYING ALTERNATIVE PATHS ===`);
                        const alternativePaths = [
                            './index.html',
                            './dist/index.html',
                            './ET-Easy-Travel/index.html'
                        ];
                        
                        for (const altPath of alternativePaths) {
                            try {
                                const exists = fs.existsSync(altPath);
                                console.log(`Path ${altPath} exists: ${exists}`);
                            } catch (e) {
                                console.log(`Error checking ${altPath}:`, e.message);
                            }
                        }
                        
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(`
                            <h1>Debug Info</h1>
                            <p>Working Directory: ${process.cwd()}</p>
                            <p>Requested: ${pathname}</p>
                            <p>Error: ${err.message}</p>
                            <p>Check server logs for detailed directory listing</p>
                        `);
                        return;
                    }
                    console.log(`=== SUCCESS SERVING INDEX.HTML ===`);
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                });
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            console.log(`=== SUCCESS SERVING FILE ===`);
            console.log(`Successfully served: ${pathname}`);
            // Get file extension and set content type
            const ext = path.extname(pathname).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(port, () => {
    console.log(`=== SERVER STARTUP ===`);
    console.log(`✅ Server-native.js v2.0 started successfully on port ${port}`);
    console.log(`📁 Working directory: ${process.cwd()}`);
    console.log(`🕐 Started at: ${new Date().toISOString()}`);
    console.log(`===================`);
});
