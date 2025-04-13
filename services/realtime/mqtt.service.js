const mqtt = require('mqtt')
require('dotenv').config();
const { EventEmitter } = require('events')


const brokerUrl = process.env.MQTT_HOST

const options = {
  connectTimeout: process.env.MQTT_CONNECT_TIMEOUT,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: process.env.MQTT_RECONNECT_PERIOD,
}

const mqttClient = mqtt.connect(brokerUrl, options);
const mqttEvents = new EventEmitter();

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('devices/+/value', () => {
    console.log('Connected to device');
    }); 
});

mqttClient.on('message', (channel, message) => {
    console.log(`MQTT: Message received on ${channel}: ${message.toString()}`)
    mqttEvents.emit('message', channel, message.toString());
    }
);

module.exports = { mqttClient, mqttEvents };