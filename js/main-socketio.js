
'use strict'
var socket = io.connect()

let msgCallback = function (msg) {
  $('#chart-content').append($('<li>').text(msg))
}

socket.on('connect', function () {
  let username = window.document.location.search.replace(/^\?username=/, '')
  socket.emit('join', username)
})

socket.on('system', msgCallback)
socket.on('message', msgCallback)

$('#send-btn').on('click', function (e) {
  var msg = $('#message').val()
  socket.emit('message', msg)
})
