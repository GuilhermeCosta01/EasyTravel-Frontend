const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

console.log('🚀 Ultra Simple Server v1.0 - Testing basic functionality');
console.log(`📁 Working Directory: ${process.cwd()}`);

const server = http.createServer((req, res) => {
    console.log(`📥 ${req.method} ${req.url}`);
    
    // Test if browser/index.html exists
    try {
        if (fs.existsSync('./browser/index.html')) {
            console.log('✅ browser/index.html exists - reading content...');
            
            const content = fs.readFileSync('./browser/index.html', 'utf8');
            console.log(`📏 Content length: ${content.length} characters`);
            console.log(`📄 Content preview: ${content.substring(0, 200)}...`);
            
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
            return;
        }
    } catch (error) {
        console.log('❌ Error reading browser/index.html:', error.message);
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
                <li>browser/index.html exists: ${fs.existsSync('./browser/index.html') ? '✅ YES' : '❌ NO'}</li>
                <li>browser/ directory exists: ${fs.existsSync('./browser/') ? '✅ YES' : '❌ NO'}</li>
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
    try {
        const browserExists = fs.existsSync('./browser/');
        const indexExists = fs.existsSync('./browser/index.html');
        
        console.log(`📁 ./browser/ exists: ${browserExists}`);
        console.log(`📄 ./browser/index.html exists: ${indexExists}`);
        
        if (indexExists) {
            const stats = fs.statSync('./browser/index.html');
            console.log(`📏 index.html size: ${stats.size} bytes`);
        }
    } catch (error) {
        console.log('❌ File system test error:', error.message);
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
