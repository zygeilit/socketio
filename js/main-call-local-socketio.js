'use strict'

var localPeer
var remotePeer

// 接受放接受请求
socket.on('receive-offer', offer => {
  offer = new RTCSessionDescription(offer)
  remotePeer.setRemoteDescription(offer)
  remotePeer.createAnswer()
    .then(anwser => {
      remotePeer.setLocalDescription(anwser)
      // 接受方准备完媒体信息后，应答给请求方
      socket.emit('send-answer', anwser)
    })
    .catch(err => console.log(`failed to create answer: ${err}`))
})

// 发起方接受应答
socket.on('receive-answer', anwser => {
  anwser = new RTCSessionDescription(anwser)
  localPeer.setRemoteDescription(anwser)
})

$("#call").on('click', function (e) {
  localPeer = new RTCPeerConnection()
  remotePeer = new RTCPeerConnection()

  // 告知对方网络链接方案（候选人）
  localPeer.onicecandidate = (e) => {
    remotePeer.addIceCandidate(e.candidate)
  }
  remotePeer.onicecandidate = (e) => {
    localPeer.addIceCandidate(e.candidate)
  }

  // 远程端接收到数据时，添加到video标签
  remotePeer.ontrack = (e) => {
    document.querySelector('#video-remote').srcObject = e.streams[0]
  }

  // 本地采集的媒体流添加到Peer
  window.localStream.getTracks().forEach(track => localPeer.addTrack(track, window.localStream))

  // 创建请求端，offerOpts获取本地媒体参数信息
  var offerOpts = {
    'offerToRecieveAudio': 0,
    'offerToRecieveVideo': 1
  }
  // Peer通讯媒体信息交换
  localPeer.createOffer(offerOpts)
    .then(offer => {
      localPeer.setLocalDescription(offer)
      // 请求方准备好媒体信息后，发送给接受方
      socket.emit('send-offer', offer)
    })
    .catch(err => 
      console.log(`failed to create offer: ${err}`)
    )
})

$("#hangup").on('click', function (e) {
  if (localPeer) {
    localPeer.close()
    localPeer = null
  }
  if (remotePeer) {
    remotePeer.close()
    remotePeer = null
  }
})
