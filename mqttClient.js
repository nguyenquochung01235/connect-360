const mqtt = require('mqtt')

const brokerUrl = 'mqtt://193.203.161.206:1883'

const options = {
  clientId: 'nodejs_mqtt_client_' + Math.random().toString(16).substr(2, 8),
  clean: true,
  connectTimeout: 60000,
  username: 'mqttuser',
  password: 'JJj&>cnz987D',
  reconnectPeriod: 1000,
}

const client = mqtt.connect(brokerUrl, options)

function getCurrentDate() {
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    return datetime;
}

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker')

  // Subscribe to a topic
  client.subscribe('devices/703365/value', (err) => {
    if (!err) {
      console.log('📡 Subscribed to devices/703365/value')
    } else {
      console.error('❌ Subscribe error:', err.message)
    }
  })

  // Publish a message
  client.publish('devices/703365/value', 'Hello MQTT from Node.js!')
})

client.on('message', (topic, message) => {
  console.log(`💬 [`+ getCurrentDate() +`] Message received on ${topic}: ${message.toString()}`)
})

client.on('error', (err) => {
  console.error('❌ MQTT Error:', err.message)
})

client.on('reconnect', () => {
  console.log('🔁 Reconnecting...')
})

client.on('close', () => {
  console.log('🚪 Disconnected')
})
