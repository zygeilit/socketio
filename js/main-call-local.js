'use strict'

var pc1
var pc2

$("#call").on('click', function (e) {
  pc1 = new RTCPeerConnection()
  pc2 = new RTCPeerConnection()

  // 告知对方网络链接方案（候选人）
  pc1.onicecandidate = (e) => {
    pc2.addIceCandidate(e.candidate)
  }
  pc2.onicecandidate = (e) => {
    pc1.addIceCandidate(e.candidate)
  }

  // 远程端接收到数据时，添加到video标签
  pc2.ontrack = (e) => {
    document.querySelector('#video-remote').srcObject = e.streams[0]
  }

  // 本地采集的媒体流添加到Peer
  window.localStream.getTracks().forEach(track => pc1.addTrack(track, window.localStream))

  // 创建请求端，offerOpts获取本地媒体参数信息
  var offerOpts = {
    'offerToRecieveAudio': 0,
    'offerToRecieveVideo': 1
  }
  // Peer通讯媒体信息交换
  pc1.createOffer(offerOpts)
    .then(offer => {
      console.log(offer)
      pc1.setLocalDescription(offer)
      pc2.setRemoteDescription(offer)
      pc2.createAnswer()
        .then(anwser => {
          console.log(anwser)
          pc2.setLocalDescription(anwser)
          pc1.setRemoteDescription(anwser)
        })
        .catch(err => console.log(`failed to create answer: ${err}`))
    })
    .catch(err => console.log(`failed to create offer: ${err}`))
})

$("#hangup").on('click', function (e) {
  if (pc1) {
    pc1.close()
    pc1 = null
  }
  if (pc2) {
    pc2.close()
    pc2 = null
  }
})
