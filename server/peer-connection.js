
module.exports = (socket, io, roomID) => {

  socket.on('send-offer', offer => {
    console.log('SocketIO Send Offer')
    io.to(roomID).emit('receive-offer', offer)
  })
  
  socket.on('send-answer', answer => {
    io.to(roomID).emit('receive-answer', answer)
  })

  socket.on('send-offer-icecandidate', icecandidate => {
    io.to(roomID).emit('receive-offer-icecandidate', icecandidate)
  })

  socket.on('send-answer-icecandidate', icecandidate => {
    io.to(roomID).emit('receive-answer-icecandidate', icecandidate)
  })
}
