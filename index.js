var express = require('express')
var ss = require('socket.io-stream')
var app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

let roomInfo = {}

app.use(express.static(__dirname))

app.get('/room/:roomID', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function (socket) {

  // 获取请求建立socket连接的url
  // 如: http://localhost:3000/room/room_1, roomID为room_1
  var url = socket.request.headers.referer
  var splited = url.split('/')
  var roomID = splited[splited.length - 1] // 获取房间ID
  var user = ''
  console.log(url)
  console.log(roomID)

  socket.on('join', function (userName) {
    user = userName
    // 将用户昵称加入房间名单中
    if (!roomInfo[roomID]) {
      roomInfo[roomID] = []
    }
    roomInfo[roomID].push(user)
    socket.join(roomID) // 加入房间
    // 通知房间内人员
    io.to(roomID).emit('system', user + '加入了房间')  
    console.log(user + '加入了' + roomID)
  })

  socket.on('leave', function () {
    socket.emit('disconnect')
  })
  
  socket.on('disconnect', function () {
    // 从房间名单中移除
    var room = roomInfo[roomID]
    if (!room) return 
    var index = roomInfo[roomID].indexOf(user)
    if (index !== -1) {
      roomInfo[roomID].splice(index, 1)
    }
    // 退出房间
    socket.leave(roomID)
    io.to(roomID).emit('system', user + '退出了房间')
    console.log(user + '退出了' + roomID)
  })

  // 接收用户消息,发送相应的房间
  socket.on('message', function (msg) {
    // 验证如果用户不在房间内则不给发送
    if (roomInfo[roomID].indexOf(user) === -1) {  
      return false
    }
    io.to(roomID).emit('message', msg)
  })

  socket.on('videostream', function (data) {
    io.to(roomID).emit('videostream-client', data)
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
