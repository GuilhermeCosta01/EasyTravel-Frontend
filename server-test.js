const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

console.log('🚀 Ultra Simple Server v1.0 - Testing basic functionality');
console.log(`📁 Working Directory: ${process.cwd()}`);

const server = http.createServer((req, res) => {
    console.log(`📥 ${req.method} ${req.url}`);
    
    // Test if the correct path exists
    const possiblePaths = [
        './dist/ET-Easy-Travel/browser/index.html',
        './ET-Easy-Travel/browser/index.html', 
        './browser/index.html',
        './index.html'
    ];
    
    for (const filePath of possiblePaths) {
        try {
            if (fs.existsSync(filePath)) {
                console.log(`✅ Found index.html at: ${filePath}`);
                
                const content = fs.readFileSync(filePath, 'utf8');
                console.log(`📏 Content length: ${content.length} characters`);
                console.log(`📄 Content preview: ${content.substring(0, 200)}...`);
                
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(content);
                return;
            } else {
                console.log(`❌ Not found: ${filePath}`);
            }
        } catch (error) {
            console.log(`❌ Error reading ${filePath}:`, error.message);
        }
    }
    
    // Simple fallback response
    const testPage = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>EasyTravel - Test Page</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>🎉 Azure Deployment Test</h1>
            <h2>Server is working!</h2>
            <p><strong>Working Directory:</strong> ${process.cwd()}</p>
            <p><strong>Requested URL:</strong> ${req.url}</p>
            <p><strong>Node.js Version:</strong> ${process.version}</p>
            
            <h3>File Status:</h3>
            <ul>
                <li>dist/ET-Easy-Travel/browser/index.html: ${fs.existsSync('./dist/ET-Easy-Travel/browser/index.html') ? '✅ YES' : '❌ NO'}</li>
                <li>ET-Easy-Travel/browser/index.html: ${fs.existsSync('./ET-Easy-Travel/browser/index.html') ? '✅ YES' : '❌ NO'}</li>
                <li>browser/index.html: ${fs.existsSync('./browser/index.html') ? '✅ YES' : '❌ NO'}</li>
                <li>index.html: ${fs.existsSync('./index.html') ? '✅ YES' : '❌ NO'}</li>
            </ul>
            
            <p><em>If you see this page, the server is running correctly and the issue is with serving the Angular files.</em></p>
        </body>
        </html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(testPage);
});

server.listen(port, () => {
    console.log(`✅ Ultra Simple Server started on port ${port}`);
    console.log(`🌐 Server is ready and listening for requests`);
    
    // Test file system on startup
    console.log('🔍 Testing file system access...');
    const testPaths = [
        './dist/ET-Easy-Travel/browser/',
        './ET-Easy-Travel/browser/', 
        './browser/',
        './dist/ET-Easy-Travel/browser/index.html',
        './ET-Easy-Travel/browser/index.html',
        './browser/index.html',
        './index.html'
    ];
    
    for (const testPath of testPaths) {
        try {
            const exists = fs.existsSync(testPath);
            console.log(`� ${testPath} exists: ${exists}`);
            
            if (exists && testPath.endsWith('index.html')) {
                const stats = fs.statSync(testPath);
                console.log(`📏 ${testPath} size: ${stats.size} bytes`);
            }
        } catch (error) {
            console.log(`❌ Error testing ${testPath}:`, error.message);
        }
    }
});

// Enhanced error handling
server.on('error', (err) => {
    console.log('❌ Server error:', err.message);
    console.log('Stack trace:', err.stack);
});

server.on('clientError', (err, socket) => {
    console.log('❌ Client error:', err.message);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

process.on('uncaughtException', (err) => {
    console.log('❌ Uncaught Exception:', err.message);
    console.log('Stack trace:', err.stack);
    // Don't exit, try to continue
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('❌ Unhandled Rejection at:', promise);
    console.log('Reason:', reason);
    // Don't exit, try to continue
});

// Keep alive signal
setInterval(() => {
    console.log(`💓 Server heartbeat - ${new Date().toISOString()}`);
}, 30000); // Every 30 seconds
