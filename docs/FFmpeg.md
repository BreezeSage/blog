# Ffmpeg

## Ffmpeg.wasm 单核使用

> https://ffmpegwasm.netlify.app/docs/getting-started/usage

<script setup>
import Ffmpeg from '../components/Ffmpeg.vue'
</script>

<Ffmpeg />

## 将视频文件分成每段 30 秒

```sh
ffmpeg -i input.mp4 -c copy -map 0 -segment_time 3 -reset_timestamps 1 -avoid_negative_ts make_zero -f segment output_%03d.mp4

# -reset_timestamps 1 将每个分割片段的时间戳重置为从 0 开始。
# -avoid_negative_ts make_zero 确保时间戳不为负数，避免播放器解析错误。
```

## 在视频文件第 20 秒位置提取一张图片

```sh
ffmpeg -ss 20 -i input.mp4 -frames:v 1 -q:v 2 output_20s.jpg
```

## Ffmpeg 常用指令

> [https://zhuanlan.zhihu.com/p/15849180981](https://zhuanlan.zhihu.com/p/15849180981)

`-b:v` 视频比特率 `500k`

`-c:v` Video 视频编码器 `libx264`

`-c:a` Audio 音频编码器 `acc` | `libmp3lame`（流行的 LAME MP3）

`-c copy` 不重新编码，直接复制流（能在格式转换时保留原始质量并大幅提速，像无损转换 MKV 转换到 MP4 时就常用到）

`-i` 输入源（多次使用 “-i” 即可依次指定）

`-preset` 视频质量（`ultrafast` 快速出片 <-> `veryslow`画质精细）

`-crf` Constant Rate Factor 画面质量（0 - 51，数值越小质量越高）

`-ss start_time -to end_time` 剪辑视频，提取片段

`ffmpeg -f concat -i videos.txt -c copy merged_video.mp4` 按照文本顺序无缝拼接视频，实现流畅的视频合并效果

`ffmpeg -i input_video.mp4 -vn -c:a libmp3lame output_audio.mp3` 提取视频中的音频

`-vn` 忽略视频流，仅仅处理音频

`-af` “volume=1.5“ 音量增大 1.5 倍

混音 TODO:

`ffmpeg -i input_video.mp4 -vf "scale=640:480" resized_video.mp4` 运用 Scale 滤镜改变视频分辨率，分辨率调整为 640\*480

`ffmpeg -i source.mp4 -vf "crop=320:240:0:0" cropped_video.mp4` Crop 滤镜裁剪画面，裁剪出左上角 320\*240 区域

`ffmpeg -i background.mp4 -i overlay_video.mp4 -filter_complex "[1:v]scale=iw/2:ih/2[ovrl];[0:v][ovrl]overlay=W-w: H-h" pip_video.mp4` 画中画效果，以 background.mp4 为背景，overlay.mp4 为小窗视频，置于右下角

`ffplay rtmp://http://live.example.com/app/streamKey` 播放网络上的 RTMP 直播流

`ffmpeg -re -i input_video.mp4 -c:v libx264 -c:a aac -f flv rtmp://server_ip/live/stream_name` 将本地视频实时推流到流媒体服务器，基于 RTMP 协议

`-re` 按视频原始帧率读取，避免因过快推送导致播放异常

`-f` 指定输出格式 flv

`ffmpeg -i input_video.mp4 -vf "scale=1280:720" -preset slow -crf 20 output_video.mp4` 将输入的文件压缩至 720p 且尽量保画质

`-vf "scale=1280:720"` 精准调整分辨率

`-preset slow` 慢工出细活，提升压缩效率

`-crf 20` 画面质量 20

`ffmpeg -i input_video.mp4 -c:v libx265 -preset medium -crf 22 output_video.mp4` 使用更好的编码格式 H.265（相同画质下文件体积可比 H.264 小 30%-50%）

码率 TODO:
