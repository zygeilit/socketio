/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict'


socket.on('videostream-client', function (stream) {
  const remoteStream = new Blob(stream, { 'type': 'video/webm' })
  alert(remoteStream)
  let recordVideo = document.querySelector('#gum-remote')
  recordVideo.src = window.URL.createObjectURL(remoteStream)
  recordVideo.play()
})

function startRecording() {
  let recordedBlobs = []
  let mediaRecorder
  let options = { 'mimeType': 'video/webmcodecs=vp9' }

  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not Supported`)
    options = { 'mimeType': 'video/webmcodecs=vp8' }
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not Supported`)
      options = { 'mimeType': 'video/webm' }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`)
        options = { 'mimeType': '' }
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options)
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e)
    return
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options)

  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event)
    console.log('Recorded Blobs: ', recordedBlobs)
  }

  mediaRecorder.ondataavailable = function (event) {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data)
    }
  }
  mediaRecorder.start(10)

  console.log('MediaRecorder started', mediaRecorder)

  setTimeout(() => {
    mediaRecorder.stop()
    socket.emit('videostream', recordedBlobs)
  }, 5000)
}