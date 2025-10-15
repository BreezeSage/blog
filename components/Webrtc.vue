<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const webrtcRef = ref<HTMLVideoElement | null>(null);
const message = ref<string[]>([]);

let rtcPeerConnection: RTCPeerConnection
let offer: RTCSessionDescriptionInit;
let sdp: string = `v=0`

onMounted(async () => {
  webrtcRef.value?.addEventListener('play', () => {
    message.value.push('视频已被触发播放')
  })
  webrtcRef.value?.addEventListener('loadedmetadata', () => {
    message.value.push('已加载元数据。')
  })
  webrtcRef.value?.addEventListener('loadeddata', () => {
    message.value.push('media 中的首帧已经完成加载。')
  })
  webrtcRef.value?.addEventListener('playing', () => {
    message.value.push('由于缺乏数据而暂停或延迟后，播放准备开始。')
  })
})

onUnmounted(() => {
  disconnect()
})

async function disconnect() {
  message.value.push('连接断开')
  webrtcRef.value?.pause()
  rtcPeerConnection?.close()
}

async function connect(streamUrl: string) {
    if (!webrtcRef.value) {
        return
    }

    webrtcRef.value.load()

    rtcPeerConnection = new RTCPeerConnection(undefined)

  rtcPeerConnection.ontrack = function (event) {
    webrtcRef.value && (webrtcRef.value.srcObject = event.streams[0])
  }

  rtcPeerConnection.addTransceiver('audio', {
    direction: 'recvonly',
  })

  rtcPeerConnection.addTransceiver('video', {
    direction: 'recvonly',
  })

  offer = await rtcPeerConnection.createOffer()
  await rtcPeerConnection.setLocalDescription(offer)

  message.value.push('正在准备连接...')

  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({
    type: 'answer',
    sdp: streamUrl,
  }))

  rtcPeerConnection.addEventListener('connectionstatechange', () => {
    if (!webrtcRef.value)
      return

    if (rtcPeerConnection.connectionState === 'connected') {
      message.value.push('webrtc 连接成功，正在缓冲加载中')

      webrtcRef.value?.load()
    
      webrtcRef.value.play().then(() => {
        message.value.push('视频加载成功')
      }).catch((err) => {
        message.value.push('视频加载过程中被中断')
        console.error(err)
      })
    }
  })
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">WebRTC Component</h1>
    <p>This is a placeholder for WebRTC functionality.</p>

    <button @click="connect('rtmp://172.0.0.1:8081/live/stream_name')" class="px-4 py-2 bg-blue-500 text-white rounded mt-4">
        connect webrtc
    </button>

    <video ref="webrtcRef" controls />
  </div>
</template>