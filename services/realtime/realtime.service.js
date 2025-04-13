require('dotenv').config();
const jwt = require('jsonwebtoken')
const WebSocket = require('ws');
const UserService = require('../user/user.service');

const WebSocketService = {}

const userSocket = new Map();
const deviceSocket = new Map();

WebSocketService.initialize = (server) => {
    const wss = new WebSocket.Server({ 
        server: server,
        path: '/realtime/device/data',
     });
    
     wss.on('connection', (ws,req) => {
        console.log("New client connected !")
        const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        
        const token = cookies?.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const username = decoded.username;
        userSocket.set(username, ws);
        UserService.getUserAndDeviceByUsername(username).then(async function(user) {
            for (let i = 0; i < user.devices.length; i++) {
                const device = user.devices[i];
                const channel = device.channel;
                if (deviceSocket.has(channel) == false) {
                    deviceSocket.set(channel, username);
                }
            }                
        }).catch(err => {
            console.log(err);
        });

        ws.on('close', () => {
            userSocket.delete(username);
            for (const [key, value] of deviceSocket.entries()) {
                if (value === username) {
                    deviceSocket.delete(key);
                }
            }
            console.log("Client disconnected !")
        });
     })
}

WebSocketService.sendDataToUserByDeviceChannel = (channel, data) => {
    const username = deviceSocket.get(channel);
    if (username && userSocket.has(username)) {
        const ws = userSocket.get(username);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    }
}


module.exports = WebSocketService;