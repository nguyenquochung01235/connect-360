const protocol = window.location.protocol.includes('https') ? 'wss': 'ws'
const ws = new WebSocket(`${protocol}://${location.host}/realtime/device/data`);
const deviceStatusList = new Map() ;
const timeout = 60000; // 60 seconds
const statusConnect = 'Đã kết nối';
const statusDisconnect = 'Không có kết nối';
var colorIndex = 0;
const listColorHeader = ["#1A73E8", "#4CAF50", "#fb8c00", "#6f42c1", "#fb8c00"];
const listDeviceGroupColor = new Map();
const deviceInactiveColorHeader = '#F44335'

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
  if(isoString){
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
  return '--';
}


function openConnectionToServer() {
  ws.onopen = function (){
    // ws.send()
  }
}

function getMessageFromServer(){
 ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  const channel = data.topic ? data.topic :`devices/${data.device_id}/value`;
  
  if(deviceStatusList.has(channel)){
    const deviceGetDataCurrentTime = new Date();
    deviceStatusList.set(channel, deviceGetDataCurrentTime);
    if(!listDeviceGroupColor.has(data.device_id)){
      listDeviceGroupColor.set(data.device_id, listColorHeader[colorIndex])
      if(listColorHeader.length - 1 > colorIndex){
        colorIndex++;
      }else{
        colorIndex = 0;
      }
    }
    updateDeviceStatus(channel, statusConnect, data.device_id ,data.label, data.value, data.alert ,data.unit, data.timestamp);
  }
 })
}

function checkDeviceStatus() {
  const currentTime = new Date().toISOString();
  deviceStatusList.forEach((lastUpdated, channel) => {
    if (new Date(currentTime) - new Date(lastUpdated) > timeout) {
      console.log("Không có kết nối với thiết bị: " + channel)
      updateDeviceStatus(channel, statusDisconnect, null ,null, null, 0 ,null, currentTime);
    }
  })
}

function updateDeviceStatus(channel ,status, device_id_group ,label, value, alert ,unit, timestamp) {
  $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-status').text(status ? status : "--");
  $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-label').text(label ? label : "--");
  if(alert == 0){
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-value').addClass('text-success').removeClass('text-primary')
  }else{
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-value').addClass('text-primary').removeClass('text-success')
  }
  $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-value').text(value ? value : "--");
  $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-unit').text(unit ? unit: "--");
  $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-last-updated').text("Cập nhật lúc: " + formatTimestamp(timestamp ? timestamp : "--"));``
  if(status === statusDisconnect){
    $(`.device-item-card[data-device-channel="${channel}"]`).css("border-top", `${deviceInactiveColorHeader} 3px solid`);
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-label').hide();
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-value').hide();
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-unit-text').hide();
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-unit').hide();
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-status').addClass('text-danger').removeClass('text-success').removeClass('text-warning');
  }
  if(status === statusConnect){
    if(listDeviceGroupColor.has(device_id_group)){
      $(`.card[data-device-channel="${channel}"]`).css("border-top", `${listDeviceGroupColor.get(device_id_group)} 3px solid`);
    }
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-label').show();
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-value').show();
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-unit-text').show();
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-unit').show();
    $(`.device-item-card[data-device-channel="${channel}"]`).find('.device-status').addClass('text-success').removeClass('text-danger').removeClass('text-warning');
  }
}

function reloadAfterCloseScreen(){
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      if (!ws || ws.readyState === WebSocket.CLOSED) {
        location.reload();
      }
    }
  });
}

// Repeat every 60,000 ms
reloadAfterCloseScreen();
setInterval(checkDeviceStatus, timeout);
openConnectionToServer();
getMessageFromServer();