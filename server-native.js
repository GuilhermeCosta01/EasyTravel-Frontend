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
    
    // First, let's understand the file structure on Azure
    console.log(`=== FILE SYSTEM DEBUG ===`);
    console.log(`Current working directory: ${process.cwd()}`);
    
    try {
        const rootFiles = fs.readdirSync('.');
        console.log(`Root directory contents:`, rootFiles);
        
        // Check if dist exists and what's inside
        if (rootFiles.includes('dist')) {
            console.log(`✅ Found dist directory!`);
            const distFiles = fs.readdirSync('./dist');
            console.log(`Dist directory contents:`, distFiles);
            
            // Check what's inside each subdirectory of dist
            for (const file of distFiles) {
                const fullPath = path.join('./dist', file);
                const stats = fs.statSync(fullPath);
                if (stats.isDirectory()) {
                    console.log(`📁 Directory ./dist/${file} contains:`);
                    try {
                        const subFiles = fs.readdirSync(fullPath);
                        console.log(`   Contents:`, subFiles);
                    } catch (e) {
                        console.log(`   Error reading: ${e.message}`);
                    }
                } else {
                    console.log(`📄 File: ./dist/${file}`);
                }
            }
        }
        
        // Check if files are directly in root
        const htmlFiles = rootFiles.filter(f => f.endsWith('.html'));
        const jsFiles = rootFiles.filter(f => f.endsWith('.js') && f !== 'server-native.js');
        const cssFiles = rootFiles.filter(f => f.endsWith('.css'));
        
        console.log(`HTML files in root:`, htmlFiles);
        console.log(`JS files in root:`, jsFiles);
        console.log(`CSS files in root:`, cssFiles);
        
    } catch (e) {
        console.log(`Error exploring file system:`, e.message);
    }
    
    // Parse URL - try multiple possible paths
    let parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    console.log(`=== PATH RESOLUTION ===`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Parsed pathname: ${parsedUrl.pathname}`);
    
    // Define possible locations for files
    const possiblePaths = [];
    
    if (parsedUrl.pathname === '/' || !path.extname(parsedUrl.pathname)) {
        // Looking for index.html - try different locations
        possiblePaths.push(
            './index.html',
            './dist/index.html', 
            './dist/ET-Easy-Travel/index.html',
            './browser/index.html'
        );
    } else {
        // Looking for a specific file
        possiblePaths.push(
            `.${parsedUrl.pathname}`,
            `./dist${parsedUrl.pathname}`,
            `./dist/ET-Easy-Travel${parsedUrl.pathname}`,
            `./browser${parsedUrl.pathname}`
        );
    }
    
    console.log(`Will try these paths in order:`, possiblePaths);
    
    // Try each possible path
    let pathIndex = 0;
    
    function tryNextPath() {
        if (pathIndex >= possiblePaths.length) {
            console.log(`❌ All paths exhausted`);
            
            // Create a detailed debug page showing file structure
            let debugHtml = `
                <h1>File Not Found - Complete Debug Info</h1>
                <h2>System Info</h2>
                <p><strong>Working Directory:</strong> ${process.cwd()}</p>
                <p><strong>Requested URL:</strong> ${req.url}</p>
                <p><strong>Node.js Version:</strong> ${process.version}</p>
                
                <h2>Tried Paths</h2>
                <ul>${possiblePaths.map(p => `<li>${p}</li>`).join('')}</ul>
                
                <h2>Available Files Structure</h2>
            `;
            
            // Add file structure to debug page
            try {
                function listDirectory(dirPath, prefix = '') {
                    const files = fs.readdirSync(dirPath);
                    let result = '<ul>';
                    
                    for (const file of files) {
                        const fullPath = path.join(dirPath, file);
                        try {
                            const stats = fs.statSync(fullPath);
                            if (stats.isDirectory()) {
                                result += `<li>📁 ${prefix}${file}/`;
                                if (prefix.length < 6) { // Avoid too deep recursion
                                    result += listDirectory(fullPath, prefix + '  ');
                                }
                                result += '</li>';
                            } else {
                                const size = (stats.size / 1024).toFixed(2);
                                result += `<li>📄 ${prefix}${file} (${size} KB)</li>`;
                            }
                        } catch (e) {
                            result += `<li>❌ ${prefix}${file} (Error: ${e.message})</li>`;
                        }
                    }
                    result += '</ul>';
                    return result;
                }
                
                debugHtml += listDirectory('.');
                
            } catch (e) {
                debugHtml += `<p>Error reading directory structure: ${e.message}</p>`;
            }
            
            debugHtml += `
                <h2>Suggestions</h2>
                <p>Based on the file structure above, the server needs to be configured to serve files from the correct location.</p>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    ul { margin: 10px 0; }
                    li { margin: 5px 0; }
                </style>
            `;
            
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(debugHtml);
            return;
        }
        
        const currentPath = possiblePaths[pathIndex];
        console.log(`🔍 Trying path [${pathIndex + 1}/${possiblePaths.length}]: ${currentPath}`);
        
        fs.readFile(currentPath, (err, data) => {
            if (err) {
                console.log(`❌ Failed: ${err.message}`);
                pathIndex++;
                tryNextPath();
            } else {
                console.log(`✅ Success! Served: ${currentPath}`);
                
                // Get file extension and set content type
                const ext = path.extname(currentPath).toLowerCase();
                const contentType = mimeTypes[ext] || 'application/octet-stream';
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    }
    
    tryNextPath();
});

server.listen(port, () => {
    console.log(`=== SERVER STARTUP ===`);
    console.log(`✅ Server-native.js v2.0 started successfully on port ${port}`);
    console.log(`📁 Working directory: ${process.cwd()}`);
    console.log(`🕐 Started at: ${new Date().toISOString()}`);
    console.log(`===================`);
});
