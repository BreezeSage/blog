<script setup lang="ts">
import Hls from 'hls.js'
import { ref } from 'vue'

const input = ref('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
const videoPlayer = ref<HTMLVideoElement | null>(null)
let hls: Hls = null;
function playVideo() {
  const m3u8Url = input.value.trim();

  // 检查URL是否为空
  if (!m3u8Url) {
    alert("请输入有效的 M3U8 链接！");
    return;
  }

  // 销毁上一个 hls 实例（如果存在），以便播放新的视频流
  if (hls) {
    hls.destroy();
  }

  // 检查浏览器是否支持 HLS
  if (Hls.isSupported()) {
    // 创建新的 Hls 实例
    hls = new Hls();
    // 加载 m3u8 链接
    hls.loadSource(m3u8Url);
    // 将 Hls 实例附加到 video 元素上
    hls.attachMedia(videoPlayer.value);
    // 当清单解析成功后，自动播放视频
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoPlayer.value.play();
      console.log("视频开始播放");
    });
    // 监听错误事件
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        console.error("发生致命错误:", data.type);
        alert(`加载视频失败: ${data.details}`);
      }
    });
  } // 对于原生支持 HLS 的设备（如 Safari）
  else if (
      videoPlayer.value.canPlayType("application/vnd.apple.mpegurl")
  ) {
    videoPlayer.value.src = m3u8Url;
    videoPlayer.value.addEventListener("loadedmetadata", () => {
      videoPlayer.value.play();
      console.log("视频开始播放 (原生支持)");
    });
  } else {
    alert("您的浏览器不支持 HLS 播放。");
  }
}

/**
 * 关闭视频的函数
 */
function closeVideo() {
  // 暂停视频
  videoPlayer.value.pause();
  // 清空视频源
  videoPlayer.value.src = "";

  // 如果存在 hls 实例，销毁它以释放资源
  if (hls) {
    hls.destroy();
    hls = null; // 将实例设为 null
  }

  console.log("视频已关闭");
}
</script>

<template>
  <div class="container">
    <!-- 输入和播放控制区域 -->
    <div class="input-section">
      <input :class="$style.input" type="text" id="m3u8-url" v-model="input" placeholder="在此处粘贴 M3U8 链接...">
      <button :class="$style.submit" id="play-btn" @click="playVideo">▶ 播放</button>
      <!-- 关闭按钮 -->
      <button :class="$style.submit" id="close-btn" title="关闭视频" @click="closeVideo">关闭视频</button>
    </div>

    <!-- 视频播放器容器 -->
    <div class="player-wrapper" id="player-wrapper">
      <!-- HTML5 video 元素 -->
      <video id="video-player" ref="videoPlayer" controls></video>
    </div>
  </div>
</template>

<style module>
.input {
  width: 100%;
  border: 1px solid var(--vp-c-divider);;
  border-radius: 4px;
  padding: 4px 12px;
}

.submit {
  border-radius: 4px;
  background-color: purple;
  color: white;
  height: 34px;
  padding: 4px 12px;
  margin-top: 8px;
}
</style>