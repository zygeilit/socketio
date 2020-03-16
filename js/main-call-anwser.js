'use strict'

console.log('Html Answer')

var peerConnection = new RTCPeerConnection()

// 告知对方网络链接方案（候选人）
peerConnection.onicecandidate = (e) => {
  socket.emit('send-answer-icecandidate', e.candidate)
}

// 远程端接收到数据时，添加到video标签
peerConnection.ontrack = (e) => {
  document.querySelector('#video-remote').srcObject = e.streams[0]
}

showView().then(stream => {
  console.log(`Media Get Success`)

  // 本地采集的媒体流添加到Peer
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))

  // 接受放接受请求
  socket.on('receive-offer', offer => {
    console.log(`Receive offer Success`, offer)

    offer = new RTCSessionDescription(offer)
    peerConnection.setRemoteDescription(offer)
    
    // 创建应答
    peerConnection.createAnswer({
      'offerToRecieveAudio': 0,
      'offerToRecieveVideo': 1
    })
      .then(answer => {
        console.log(`Send answer`, answer)
        peerConnection.setLocalDescription(answer)
        socket.emit('send-answer', answer)
      })
      .catch(err =>
        console.log(`failed to create answer: ${err}`)
      )
  })

  socket.on('receive-offer-icecandidate', candidate => {
    console.log(`Receive Offer Icecandidate`, candidate)
    // candidate = new RTCIceCandidate(candidate)
    peerConnection.addIceCandidate(candidate)
  })
})

$("#hangup").on('click', function (e) {
  if (peerConnection) {
    peerConnection.close()
    peerConnection = null
  }
})
