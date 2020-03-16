
module.exports = (socket, io, roomID) => {

  socket.on('send-offer', offer => {
    io.to(roomID).emit('receive-offer', offer)
  })
  
  socket.on('send-answer', answer => {
    io.to(roomID).emit('receive-answer', answer)
  })
}
