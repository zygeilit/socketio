var express = require('express')
var app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var path = require('path')
var urlParse = require('url-parse')
var peerConnection = require('./peer-connection')

let roomInfo = {}

app.use(express.static(path.join(__dirname, '..')))

app.get('/', function (req, res) {
  console.log(`Nodejs Router: HOME`)
  res.sendFile(path.join(__dirname, '..', '/html/index.html'))
})

app.get('/room/:roomID', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '/html/room.html'))
})

app.get('/room-offer/:roomID', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '/html/room-offer.html'))
})
app.get('/room-answer/:roomID', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '/html/room-anwser.html'))
})

io.on('connection', function (socket) {

  var url = socket.request.headers.referer
  var splited = urlParse(url).pathname.split('/')
  var roomID = splited[splited.length - 1] // 获取房间ID
  var user = ''

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

    // 房间内用户个数
    io.to(roomID).emit('user-joined-number', roomInfo[roomID].length)
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

  socket.on('drawing-board-changed', function (base64img) {
    socket.broadcast.to(roomID).emit('drawing-board-changed-received', base64img)
  })

  peerConnection(socket, io, roomID)
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
