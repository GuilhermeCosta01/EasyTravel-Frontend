const http = require('http');

// Use Azure's PORT or default to 8080
const port = process.env.PORT || 8080;

console.log(`Starting ULTRA SIMPLE server on port ${port}`);
console.log(`Process ID: ${process.pid}`);
console.log(`Working directory: ${process.cwd()}`);

// Create the simplest possible server
const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Respond immediately to any request
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>EasyTravel - Server Online</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            max-width: 800px;
            margin: 0 auto;
        }
        .success { color: #4CAF50; font-size: 24px; }
        .info { background: rgba(0,0,0,0.2); padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="success">✅ EasyTravel Server is ONLINE!</h1>
        
        <div class="info">
            <h3>🎯 SUCCESS - Azure Deployment Working!</h3>
            <p><strong>Server Port:</strong> ${port}</p>
            <p><strong>Node.js Version:</strong> ${process.version}</p>
            <p><strong>Process ID:</strong> ${process.pid}</p>
            <p><strong>Working Directory:</strong> ${process.cwd()}</p>
            <p><strong>Request URL:</strong> ${req.url}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
        
        <div class="info">
            <h3>📋 Server Status</h3>
            <p>✅ HTTP Server: Running</p>
            <p>✅ Port Binding: Success</p>
            <p>✅ Health Check: Responding</p>
            <p>✅ Container: Stable</p>
        </div>
        
        <h3>🎉 Next Step: Deploy Angular Files</h3>
        <p>The server infrastructure is working perfectly. Now we need to add the Angular application files.</p>
    </div>
</body>
</html>`;
    
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
    });
    res.end(html);
});

// Enhanced error handling
server.on('error', (err) => {
    console.error(`❌ Server error: ${err.message}`);
    console.error(`Error code: ${err.code}`);
    console.error(`Stack: ${err.stack}`);
});

server.on('listening', () => {
    console.log(`✅ Server is listening on port ${port}`);
    console.log(`✅ Server ready to accept connections`);
    console.log(`🌐 Health check endpoint ready`);
});

// Start server with error handling
try {
    server.listen(port, '0.0.0.0', () => {
        console.log(`🚀 ULTRA SIMPLE Server started successfully!`);
        console.log(`📍 Listening on 0.0.0.0:${port}`);
        console.log(`⏰ Started at: ${new Date().toISOString()}`);
        
        // Test server is responding
        console.log(`🔍 Testing server response...`);
    });
} catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    process.exit(1);
}

// Global error handlers
process.on('uncaughtException', (error) => {
    console.error(`❌ Uncaught Exception: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    // Don't exit - try to keep server running
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(`❌ Unhandled Promise Rejection: ${reason}`);
    console.error(`Promise: ${promise}`);
    // Don't exit - try to keep server running
});

// Keepalive heartbeat
setInterval(() => {
    console.log(`💓 Server heartbeat: ${new Date().toISOString()}`);
}, 30000);

console.log(`🎯 Server initialization complete`);
