
'use strict'

function getConnectedDevices(callback) {
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      callback(devices)
    })
}

// 设备发生变化后出发，比如USB新链接的摄像头
navigator.mediaDevices.addEventListener('devicechange', event => {
  getConnectedDevices()
})

document.querySelector('#getDevices').addEventListener('click', e => {
  getConnectedDevices(devices =>
    console.log(JSON.stringify(devices, null, 2))
  )
})

