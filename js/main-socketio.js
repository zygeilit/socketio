/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict'
var socket = io.connect()

let msgCallback = function (msg) {
  $('#chart-content').append($('<li>').text(msg))
}

socket.on('connect', function () {
  socket.emit('join', 'zhangyue')
})

socket.on('system', msgCallback)
socket.on('message', msgCallback)

$('#send-btn').on('click', function (e) {
  var msg = $('#message').val()
  socket.emit('message', msg)
})
