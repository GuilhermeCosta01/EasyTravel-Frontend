const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

console.log('🚀 Starting Simple Server v1.0');
console.log(`📁 Working Directory: ${process.cwd()}`);
console.log(`🔍 Exploring file structure...`);

// Explore file structure on startup
try {
    const files = fs.readdirSync('.');
    console.log('📋 Root files:', files);
    
    if (files.includes('dist')) {
        const distFiles = fs.readdirSync('./dist');
        console.log('📋 Dist files:', distFiles);
    }
} catch (e) {
    console.log('❌ Error exploring files:', e.message);
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`📥 ${req.method} ${req.url}`);
    
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Remove query parameters
    if (filePath.includes('?')) {
        filePath = filePath.split('?')[0];
    }
    
    console.log(`🔍 Looking for: ${filePath}`);
    
    // Try different base paths - browser first since that's where index.html is
    const basePaths = ['./browser', '.', './dist/ET-Easy-Travel', './dist'];
    
    for (const basePath of basePaths) {
        const fullPath = path.join(basePath, filePath);
        console.log(`🔍 Trying: ${fullPath}`);
        
        try {
            if (fs.existsSync(fullPath)) {
                console.log(`✅ Found: ${fullPath}`);
                
                const data = fs.readFileSync(fullPath);
                const ext = path.extname(fullPath);
                const contentType = mimeTypes[ext] || 'application/octet-stream';
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
                return;
            }
        } catch (e) {
            console.log(`❌ Error reading ${fullPath}:`, e.message);
        }
    }
    
    // If nothing found and it's a route (no file extension), serve index.html
    if (!path.extname(filePath)) {
        console.log(`🔄 No file extension, trying index.html for SPA routing`);
        
        for (const basePath of basePaths) {
            const indexPath = path.join(basePath, 'index.html');
            
            try {
                if (fs.existsSync(indexPath)) {
                    console.log(`✅ Found index.html: ${indexPath}`);
                    
                    const data = fs.readFileSync(indexPath);
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                    return;
                }
            } catch (e) {
                console.log(`❌ Error reading index ${indexPath}:`, e.message);
            }
        }
    }
    
    // Generate debug page if nothing found
    console.log(`❌ File not found: ${filePath}`);
    
    let debugInfo = `
        <html>
        <head><title>Debug - File Structure</title></head>
        <body>
            <h1>EasyTravel - Debug Info</h1>
            <h2>Request Info</h2>
            <p><strong>URL:</strong> ${req.url}</p>
            <p><strong>File Path:</strong> ${filePath}</p>
            <p><strong>Working Dir:</strong> ${process.cwd()}</p>
            
            <h2>Available Files</h2>
    `;
    
    try {
        function listFiles(dir, prefix = '') {
            const files = fs.readdirSync(dir);
            let result = '<ul>';
            
            files.forEach(file => {
                const fullPath = path.join(dir, file);
                const stats = fs.statSync(fullPath);
                
                if (stats.isDirectory() && prefix.length < 4) {
                    result += `<li>📁 ${file}/` + listFiles(fullPath, prefix + '  ') + '</li>';
                } else if (stats.isFile()) {
                    const size = (stats.size / 1024).toFixed(1);
                    result += `<li>📄 ${file} (${size}KB)</li>`;
                }
            });
            
            return result + '</ul>';
        }
        
        debugInfo += listFiles('.');
        
    } catch (e) {
        debugInfo += `<p>Error listing files: ${e.message}</p>`;
    }
    
    debugInfo += `
            <style>
                body { font-family: Arial; margin: 20px; }
                ul { margin-left: 20px; }
            </style>
        </body>
        </html>
    `;
    
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(debugInfo);
});

server.listen(port, () => {
    console.log(`✅ Simple Server started successfully on port ${port}`);
    console.log(`🌐 Server ready to handle requests`);
});

// Handle errors
server.on('error', (err) => {
    console.log('❌ Server error:', err);
});

process.on('uncaughtException', (err) => {
    console.log('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
