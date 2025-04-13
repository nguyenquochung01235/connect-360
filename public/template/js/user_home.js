const protocol = window.location.protocol.includes('https') ? 'wss': 'ws'
const ws = new WebSocket(`${protocol}://${location.host}/realtime/device/data`);
const deviceStatusList = new Map() ;
const timeout = 10000; // 10 seconds
const statusConnect = 'Đã kết nối';
const statusDisconnect = 'Không có kết nối';

$(document).ready(function() {
  $('.device-item-card').each(function () { 
      if($(this).attr('data-device-channel') != null){
        const last_updated = new Date().toISOString();
        const channel = $(this).attr('data-device-channel')
        deviceStatusList.set(channel, last_updated);
      }
  });
});

function formatTimestamp(isoString) {
  const date = new Date(isoString);

  const pad = (n) => n.toString().padStart(2, '0');

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // months are 0-based
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
}


function openConnectionToServer() {
  ws.onopen = function (){
    // ws.send()
  }
}

function getMessageFromServer(){
 ws.addEventListener('message', event => {
  console.log(event.data);
  const data = JSON.parse(event.data);
  const channel = `devices/${data.deviceId}/value`;
  if(deviceStatusList.has(channel)){
    deviceStatusList.set(channel, new Date(data.timestamp));
    updateDeviceStatus(channel, statusConnect, data.temperature, data.humidity, data.unit, data.timestamp);
  }
 })
}

function checkDeviceStatus() {
  const currentTime = new Date().toISOString();
  deviceStatusList.forEach((lastUpdated, channel) => {
    if (new Date(currentTime) - new Date(lastUpdated) > timeout) {
      updateDeviceStatus(channel, statusDisconnect, '--', '--', '-', currentTime);
    }
  })
}

function updateDeviceStatus(channel, status, temperature, humidity, unit, timestamp) {
  $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-status').text(status);
  $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-temperature').text(temperature);
  $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-humidity').text(humidity);
  $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-unit').text(`°${unit}`);
  $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-last-updated').text(formatTimestamp(timestamp));``
  if(status === statusDisconnect){
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-status').addClass('text-danger').removeClass('text-success').removeClass('text-warning');
  }
  if(status === statusConnect){
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-status').addClass('text-success').removeClass('text-danger').removeClass('text-warning');
  }
}

// Repeat every 60,000 ms
setInterval(checkDeviceStatus, timeout);

openConnectionToServer();
getMessageFromServer();