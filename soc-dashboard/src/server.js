// Minimal HTTP server exposing SSE endpoint and metrics for the SOC Dashboard
const http = require('http');
const url = require('url');
const fs = require('fs');
const EventBus = require('../../event-bus/src/publisher/EventBusPublisher');
const IncidentService = require('./services/IncidentService');
const DashboardService = require('./services/DashboardService');

const PORT = process.env.PORT || 3002;

// Wire services
const bus = EventBus.getInstance();
const incidentService = new IncidentService(null, bus);
const dashboardService = new DashboardService(incidentService);

// WebSocket server clients set
const WebSocket = require('ws');
const wsClients = new Set();

// Broadcast helper for WS clients
function broadcastToWs(event) {
    const payload = JSON.stringify(event);
    wsClients.forEach(ws => {
        try {
            if (ws.readyState === WebSocket.OPEN) ws.send(payload);
        } catch (e) { /* ignore client errors */ }
    });
}

// Subscribe dashboardService to broadcast to WS clients
dashboardService.subscribe(broadcastToWs);

// Simple router
const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    if (req.method === 'GET' && parsed.pathname === '/events') {
        // SSE endpoint
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        const listener = (event) => {
            try {
                res.write(`data: ${JSON.stringify(event)}\n\n`);
            } catch (e) { /* ignore */ }
        };

        dashboardService.subscribe(listener);

        // ping to keep connection open
        const keepAlive = setInterval(() => res.write(': keep-alive\n\n'), 20000);

        req.on('close', () => {
            clearInterval(keepAlive);
            dashboardService.unsubscribe(listener);
        });
        return;
    }

    if (req.method === 'GET' && parsed.pathname === '/metrics') {
        try {
            const metrics = await dashboardService.getMetrics();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: metrics }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    if (req.method === 'GET' && parsed.pathname === '/summary') {
        try {
            const summary = await dashboardService.getSummary();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: summary }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    if (req.method === 'POST' && parsed.pathname === '/incidents') {
        // create incident via IncidentService to exercise event flow
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const payload = body ? JSON.parse(body) : {};
                const incident = await incidentService.create(payload);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: incident }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // serve demo frontend
    if (req.method === 'GET' && (parsed.pathname === '/' || parsed.pathname === '/index.html')) {
        const file = require('path').join(__dirname, 'views', 'index.html');
        fs.readFile(file, (err, data) => {
            if (err) { res.writeHead(500); res.end('Error'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    // default
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Not found' }));
});

// Attach WebSocket server to same HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    wsClients.add(ws);
    ws.send(JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() }));

    ws.on('message', (msg) => {
        // echo or implement simple control messages
        try {
            const parsed = JSON.parse(msg.toString());
            if (parsed.type === 'PING') ws.send(JSON.stringify({ type: 'PONG' }));
        } catch (e) { /* ignore */ }
    });

    ws.on('close', () => wsClients.delete(ws));
});

server.listen(PORT, () => console.log(`SOC Dashboard server running on http://localhost:${PORT}`));

module.exports = server;
