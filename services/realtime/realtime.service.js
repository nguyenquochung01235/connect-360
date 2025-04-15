require('dotenv').config();
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const UserService = require('../user/user.service');

const WebSocketService = {};

const userSocket = new Map(); // username -> Set of WebSockets
const deviceSocket = new Map(); // channel -> Set of usernames

WebSocketService.initialize = (server) => {
    const wss = new WebSocket.Server({ 
        server: server,
        path: '/realtime/device/data',
    });

    wss.on('connection', (ws, req) => {
        console.log("New client connected!");
        
        const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        
        const token = cookies?.token;
        let username;
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            username = decoded.username;
        } catch (err) {
            console.error("Invalid JWT Token:", err);
            ws.close();
            return;
        }

        // Store WebSocket in userSocket map
        if (!userSocket.has(username)) {
            userSocket.set(username, new Set());
        }
        userSocket.get(username).add(ws);

        // Associate this user to their devices
        UserService.getUserAndDeviceByUsername(username).then(user => {
            user.devices.forEach(device => {
                const channel = device.channel;
                if (!deviceSocket.has(channel)) {
                    deviceSocket.set(channel, new Set());
                }
                deviceSocket.get(channel).add(username);
            });
        }).catch(err => {
            console.log("Error fetching user device info:", err);
        });

        ws.on('close', () => {
            // Remove this socket from the user's list
            if (userSocket.has(username)) {
                userSocket.get(username).delete(ws);
                if (userSocket.get(username).size === 0) {
                    userSocket.delete(username);
                }
            }

            // Clean up deviceSocket entries (if no more connections for that user)
            for (const [channel, userSet] of deviceSocket.entries()) {
                userSet.delete(username);
                if (userSet.size === 0) {
                    deviceSocket.delete(channel);
                }
            }

            console.log("Client disconnected!");
        });
    });
};

WebSocketService.sendDataToUserByDeviceChannel = (channel, data) => {
    const userSet = deviceSocket.get(channel);
    if (userSet) {
        userSet.forEach(username => {
            const wsSet = userSocket.get(username);
            if (wsSet) {
                wsSet.forEach(ws => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(data);
                    }
                });
            }
        });
    }
};

module.exports = WebSocketService;