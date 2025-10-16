<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const panelRef = ref<HTMLDivElement | null>(null)
const isFocused = ref(false)
const videoSrc = ref("")
const videoPlayer = ref<HTMLVideoElement | null>(null)
const audioSrc = ref("")
const statusText = reactive({
  textContent: '',
  imgUrls: []
})
const frameCanvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null
onMounted(() => {
  ctx = frameCanvas.value.getContext("2d");
})

function dragover() {
  isFocused.value = true
}

function dragleave() {
  isFocused.value = false
}

function drop(e) {
  isFocused.value = false
  const files = e.dataTransfer.files;
  handleFileSelect({
    target: { files: files },
  });

}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const videoURL = URL.createObjectURL(file);
  videoSrc.value = videoURL;
  audioSrc.value = videoURL;

  videoPlayer.value.addEventListener(
      "loadedmetadata",
      handleMetadataLoaded,
      { once: true },
  );

  // 元数据加载完成
  function handleMetadataLoaded() {
    statusText.textContent = "视频加载完成，准备解析...";
    frameCanvas.value.width = videoPlayer.value.videoWidth;
    frameCanvas.value.height = videoPlayer.value.videoHeight;
    // extractFrames();
  }
}

function loadedmetadata() {
  extractFrames()
}

// 核心：提取帧
async function extractFrames() {
  const duration = videoPlayer.value.duration;
  if (!duration || !isFinite(duration)) {
    statusText.textContent = "错误：无法获取视频时长。";
    // resetButton.style.display = "block";
    return;
  }

  const NUM_FRAMES = 24; // 增加帧数以更好地填充空间
  const interval = duration / NUM_FRAMES;

  for (let i = 0; i < NUM_FRAMES; i++) {
    const time = i * interval;
    const progress = ((i + 1) / NUM_FRAMES) *
        100;

    statusText.textContent = `正在解析第 ${
        i + 1
    } / ${NUM_FRAMES} 帧...`;
    console.log(`${progress}%`)

    await captureFrame(time);
  }

  statusText.textContent = "✅ 解析完成！";
  // resetButton.style.display = "block";
}

// 捕获单帧
function captureFrame(time) {
  return new Promise((resolve) => {
    console.log('captureFrame', time);
    const onSeeked = () => {
      console.log(123123)
      ctx?.drawImage(
          videoPlayer.value,
          0,
          0,
          frameCanvas.value.width,
          frameCanvas.value.height,
      );
      const imageDataUrl = frameCanvas.value
          .toDataURL("image/jpeg", 0.85);

      statusText.imgUrls.push({
        url: imageDataUrl,
      })
      // const thumbnail = document
      //     .createElement("div");
      // thumbnail.className = "thumbnail";
      //
      // const img = document.createElement(
      //     "img",
      // );
      // img.src = imageDataUrl;

      // const timestamp = document
      //     .createElement("div");
      // timestamp.className = "timestamp";
      // timestamp.textContent = `${time.toFixed(1)}s`;
      //
      // thumbnail.append(img, timestamp);
      //
      // thumbnail.onclick = () => {
      //   videoPlayer.currentTime = time;
      //   videoPlayer.play();
      // };

      // imageGallery.appendChild(thumbnail);
      resolve();
    };
    videoPlayer.value.addEventListener(
        "seeked",
        onSeeked,
        { once: true },
    );
    videoPlayer.value.currentTime = time;
  });
}
</script>

<template>
  <div :class="$style.container">
    <div
        :class="isFocused ? $style.panel_active : $style.panel"
        ref="panelRef"
        @dragover.prevent="dragover"
        @dragleave.prevent="dragleave"
        @drop.prevent="drop">
      将文件拖拽到这里
    </div>

    <canvas :class="$style.canvas" ref="frameCanvas"></canvas>
    <p>{{statusText.textContent || "welcome"}}</p>

    <p>视频</p>
    <video
        :class="$style.video"
        :src="videoSrc"
        controls
        ref="videoPlayer"
        @loadeddata.once="loadedmetadata"
    ></video>
    <p>音频</p>
    <audio :class="$style.audio" :src="audioSrc" controls/>
    <p>视频帧</p>
    <div :class="$style.imgs">
      <img :src="item.url" alt="" v-for="item in statusText.imgUrls" :key="item.url" />
    </div>
  </div>
</template>

<style module>
.container {
  margin-top: 24px;
}

.panel {
  width: 100%;
  height: 80px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.panel_show {
  display: flex;
  margin-top: 8px;
  gap: 8px;
}

.panel_active {
  width: 100%;
  height: 80px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-divider);
  display: flex;
  justify-content: center;
  align-items: center;
}

.video {
  width: 100%;
}

.canvas {
  display: none;
}

.imgs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.imgs img {
  border-radius: 4px;
  transition: all 0.15s ease-in-out;
}

.imgs img:hover {
  transform: scale(1.1);
}
</style>