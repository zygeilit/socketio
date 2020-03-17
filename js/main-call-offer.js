'use strict'

console.log('Html Offer')

var peerConnection = new RTCPeerConnection({
  'iceServers': [{
    "urls": [ "stun:stun.l.google.com:19302" ]
  }]
})

// 告知对方网络链接方案（候选人）
peerConnection.onicecandidate = (e) => {
  socket.emit('send-offer-icecandidate', e.candidate)
}

// 远程端接收到数据时，添加到video标签
peerConnection.ontrack = (e) => {
  document.querySelector('#video-remote').srcObject = e.streams[0]
}

// 发起方接受应答
socket.on('receive-answer', anwser => {
  console.log(`Receive Answer`, anwser)
  anwser = new RTCSessionDescription(anwser)
  peerConnection.setRemoteDescription(anwser)
})

socket.on('drawing-board-changed-received', function (base64img) {
  defaultBoard.setImg(base64img)
})

showView().then(stream => {
  console.log(`Media Get Success`)

  // 本地采集的媒体流添加到Peer
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))

  // 创建请求端，offerOpts获取本地媒体参数信息
  // Peer通讯媒体信息交换
  peerConnection.createOffer({
    'offerToRecieveAudio': 1,
    'offerToRecieveVideo': 1,
    'iceRestart': true,
    'voiceActivityDetection': true
  })
    .then(offer => {
      console.log(`Send Offer`, offer)

      peerConnection.setLocalDescription(offer)
      // 请求方准备好媒体信息后，发送给接受方
      socket.emit('send-offer', offer)
    })
    .catch(err =>
      console.log(`failed to create offer: ${err}`)
    )
})

$("#hangup").on('click', function (e) {
  if (peerConnection) {
    peerConnection.close()
    peerConnection = null
  }
})

var defaultBoard = new DrawingBoard.Board('default-board');

defaultBoard.ev.bind('board:stopDrawing', (e) => {
  let base64img = sessionStorage.getItem('drawing-board-default-board')
  socket.emit('drawing-board-changed', base64img)
})

socket.on('receive-answer-icecandidate', candidate => {
  console.log(`Receive Answer Icecandidate`, candidate)
  peerConnection.addIceCandidate(candidate)
})
