require('dotenv').config();


const http = require('http');
const app = require('./app');
const { mqttEvents } = require('./services/realtime/mqtt.service');
const WebSocketService = require('./services/realtime/realtime.service');

const port = process.env.PORT || 3003;

const server = http.createServer(app);
WebSocketService.initialize(server);

mqttEvents.on('message', (channel, data) => {
    WebSocketService.sendDataToUserByDeviceChannel(channel, data);
});

server.listen(port,function(){
    console.log(`Node server running @ http://localhost:${port}`)
});
