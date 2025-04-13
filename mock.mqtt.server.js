const aedes = require('aedes')();
const net = require('net');

const PORT = 1883;
const server = net.createServer(aedes.handle);

server.listen(PORT, () => {
    console.log(`🚀 Mock MQTT broker running on port ${PORT}`);
});

// Topic to auto-publish
const mockTopic = 'devices/703365/value';

// Auto send data every 30s
setInterval(() => {
    const payload = JSON.stringify({
        deviceId: '703365',
        timestamp: new Date().toISOString(),
        temperature: (20 + Math.random() * 10).toFixed(2), // 20°C–30°C random
        unit: 'C',
        humidity: (40 + Math.random() * 20).toFixed(2),    // 40%–60% random
    });

    const packet = {
        topic: mockTopic,
        payload: payload,
        qos: 0,
        retain: false,
    };

    aedes.publish(packet, () => {
        console.log(`📡 Published to ${mockTopic}: ${payload}`);
    });
}, 10000); // 30 seconds

// Log connected clients
aedes.on('clientReady', (client) => {
    console.log(`✅ Client connected: ${client.id}`);
});

aedes.on('subscribe', (subscriptions, client) => {
    if (client) {
        console.log(`📥 ${client.id} subscribed to ${subscriptions.map(s => s.topic).join(', ')}`);
    }
});
