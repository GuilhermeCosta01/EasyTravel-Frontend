const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8080;

console.log('🚀 Minimal Server v2.0 - Starting...');
console.log(`⏰ Deploy Timestamp: ${new Date().toISOString()}`);
console.log(`📁 Working Directory: ${process.cwd()}`);

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>EasyTravel - Azure Deployment Success</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        h1 { color: #4CAF50; }
        .status { background: rgba(76,175,80,0.2); padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 EasyTravel - Server Running Successfully!</h1>
        
        <div class="status">
            <h2>✅ Deployment Status: SUCCESS</h2>
            <p><strong>Working Directory:</strong> ${process.cwd()}</p>
            <p><strong>Node.js Version:</strong> ${process.version}</p>
            <p><strong>Server Port:</strong> ${port}</p>
            <p><strong>Container Status:</strong> Running Stable</p>
        </div>
        
        <h3>🔍 File System Analysis</h3>
        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 5px; font-family: monospace;">
`;

    try {
        const files = fs.readdirSync('.');
        html += '<strong>Root Directory Contents:</strong><br>';
        files.forEach(file => {
            try {
                const stats = fs.statSync(file);
                if (stats.isDirectory()) {
                    html += `📁 ${file}/<br>`;
                } else {
                    html += `📄 ${file} (${Math.round(stats.size/1024)}KB)<br>`;
                }
            } catch (e) {
                html += `❌ ${file} (error)<br>`;
            }
        });
        
        // Check for Angular files
        const possiblePaths = [
            'dist/ET-Easy-Travel/browser/index.html',
            'ET-Easy-Travel/browser/index.html',
            'browser/index.html',
            'index.html'
        ];
        
        html += '<br><strong>Angular Files Search:</strong><br>';
        possiblePaths.forEach(path => {
            const exists = fs.existsSync(path);
            html += `${exists ? '✅' : '❌'} ${path}<br>`;
        });
        
    } catch (e) {
        html += `Error reading directory: ${e.message}<br>`;
    }
    
    html += `
        </div>
        
        <h3>🎯 Next Steps</h3>
        <p>This server is running stably. The Angular files need to be properly deployed in the workflow.</p>
        <p><strong>Container uptime:</strong> <span id="uptime">Loading...</span></p>
        
        <script>
            let startTime = Date.now();
            setInterval(() => {
                let uptime = Math.floor((Date.now() - startTime) / 1000);
                document.getElementById('uptime').textContent = uptime + ' seconds';
            }, 1000);
        </script>
    </div>
</body>
</html>`;
    
    res.writeHead(200, { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
    });
    res.end(html);
});

// Simple error handling - don't crash
server.on('error', (err) => {
    console.log('Server error (not crashing):', err.message);
});

process.on('uncaughtException', (err) => {
    console.log('Uncaught exception (handled):', err.message);
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled rejection (handled):', err);
});

// Start server
server.listen(port, () => {
    console.log(`✅ Minimal Server started successfully on port ${port}`);
    console.log(`🌐 Ready to serve requests`);
});

// Simple keepalive every 60 seconds (less frequent)
setInterval(() => {
    console.log(`Server alive: ${new Date().toISOString()}`);
}, 60000);
