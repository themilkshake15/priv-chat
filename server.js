const { WebSocketServer } = require('ws');

// Render automatically assigns a random port number in production via process.env.PORT
// If that doesn't exist, it defaults to 8080 for your local test runs
const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`=========================================`);
console.log(`💀 PRIV-CHAT ENGINE ONLINE ON PORT ${PORT}`);
console.log(`=========================================`);

const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log(`[NODE CONNECTED] Active nodes: ${clients.size}`);

    ws.on('message', (packetData) => {
        // Forward the encrypted package directly to everyone else connected
        for (const client of clients) {
            if (client !== ws && client.readyState === 1) {
                client.send(packetData.toString());
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log(`[NODE DISCONNECTED] Active nodes: ${clients.size}`);
    });
});
