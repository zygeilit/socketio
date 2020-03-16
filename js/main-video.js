/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict'

// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
  "audio": false, // { 'echoCancellation': true },
  "video": {
    "width": 1280,
    "height": 720
  }
}

document.querySelector('#showVideo').addEventListener('click', async e => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    const video = document.querySelector('video')
    const videoTracks = stream.getVideoTracks() // remote Peer

    console.log('Got stream with constraints:', constraints)
    console.log(`Using video device: ${videoTracks[0].label}, ${videoTracks.length}`)
    console.log(`Get Constraints: ${JSON.stringify(videoTracks[0].getSettings(), null, 2)}`) // applyConstraints

    window.localStream = stream // make variable available to browser console
    video.srcObject = stream

    e.target.disabled = true
  } catch (err) {

    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = constraints.video
      console.log(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`)
    } else if (error.name === 'PermissionDeniedError') {
      console.log('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.')
    }
    console.log(`getUserMedia error: ${error.name}`, error)
  }
})
