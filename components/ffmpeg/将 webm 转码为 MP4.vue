<template>
  <video :class="$style.video" :src="video" controls />
  <br />
  <input :class="$style.input" v-model="videoURL" />
  <button :class="$style.submit" @click="transcode">Start</button>
  <p>日志：{{ message }}</p>
</template>

<script setup lang="ts">
import { FFmpeg } from "@ffmpeg/ffmpeg";
import type { LogEvent } from "@ffmpeg/ffmpeg/dist/esm/types";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { ref } from "vue";

const baseURL = "/core";
const videoURL = ref("https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi")

    const ffmpeg = new FFmpeg();
    const message = ref("Click Start to Transcode");
    let video = ref("");

    async function transcode() {
      message.value = "Loading ffmpeg-core.js";
      ffmpeg.on("log", ({ message: msg }: LogEvent) => {
        message.value = msg;
      });
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      message.value = "Start transcoding";
      await ffmpeg.writeFile("test.avi", await fetchFile(videoURL.value));
      await ffmpeg.exec(["-i", "test.avi", "test.mp4"]);
      message.value = "Complete transcoding";
      const data = await ffmpeg.readFile("test.mp4");
      video.value = URL.createObjectURL(
        new Blob([(data as Uint8Array).buffer], { type: "video/mp4" })
      );
    }
</script>

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
.video {
  width: 100%;
}
</style>