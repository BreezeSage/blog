<template lang="">
  <div :class="$style.card">
    <div :class="$style['top-row']">
      <input
        :class="$style['input']"
        v-model="input"
        type="text"
        placeholder="输入文本..."
        :disabled="generating"
      />

      <select
        v-model="selectedAlgorithm"
        :class="$style['select']"
        :disabled="generating"
      >
        <option value="mosaic">mosaic（几何拼图风）</option>
        <option value="weave">weave（星轨交织）</option>
        <option value="sigil">sigil（生成徽章）</option>
        <option value="radial">radial（径向新星）</option>
        <option value="pixel">pixel（像素方块）</option>
      </select>

      <button
        :class="$style['submit']"
        @click="createAvatar"
        :disabled="generating"
      >
        {{ generating ? "生成中..." : `生成头像 - ${ALGO_DESCRIPTIONS[selectedAlgorithm]}` }}
      </button>
    </div>

    <div :class="$style['canvas-area']">
      <div
        :class="[
          $style['canvas-wrapper'],
          generating && $style.generating,
          reveal && $style.reveal,
        ]"
      >
        <canvas
          ref="avatarCanvas"
          :class="$style.canvas"
          width="300"
          height="300"
        ></canvas>

        <div v-if="generating" :class="$style.spinner" aria-hidden="true"></div>
        <!-- save icon button in canvas corner -->
        <button
          :class="$style['save-icon']"
          @click="downloadAvatar"
          :disabled="generating"
          title="保存头像"
          aria-label="保存头像"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 16V4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 10L12 4L18 10"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div :class="$style['actions']">
        <!-- save icon moved into canvas wrapper -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";

const generating = ref(false);
const reveal = ref(false);

const input = ref("failture to generate avatar");
const selectedAlgorithm = ref<
  "weave" | "sigil" | "radial" | "pixel" | "mosaic"
>("mosaic");
const avatarCanvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D;
import { ALGORITHMS, generateHash } from "./utils";
import { ALGO_DESCRIPTIONS } from "./constant";

onMounted(() => {
  if (avatarCanvas.value) {
    const canvas = avatarCanvas.value;
    canvas.id = "avatar-canvas";
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  }
  createAvatar();
});

async function updateAvatar() {
  // perform drawing into canvas context
  const e = await generateHash(input.value || "default");
  ALGORITHMS[selectedAlgorithm.value](ctx, e);
}

const createAvatar = async () => {
  if (generating.value) return;
  generating.value = true;
  reveal.value = false;

  // small delay to show spinner and improve perceived performance
  await new Promise((r) => setTimeout(r, 300));

  try {
    await updateAvatar();
    // brief pause then reveal with scale/opacity transition
    await new Promise((r) => setTimeout(r, 250));
    reveal.value = true;
  } finally {
    generating.value = false;
  }
};
const downloadAvatar = () => {
  if (!avatarCanvas.value) return;
  const link = document.createElement("a");
  link.download = `avatar-${input.value || "default"}.png`;
  link.href = avatarCanvas.value.toDataURL("image/png");
  link.click();
};
</script>
<style module>
.header {
  margin-bottom: 12px;
}
.header h3 {
  margin: 0 0 4px 0;
}
.muted {
  color: var(--vp-c-muted, #6b7280);
  margin: 0;
  font-size: 13px;
}
.top-row {
  display: flex;
  gap: 8px;
  flex-direction: column;
}
.input {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}
.select {
  width: 220px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 12px;
}
.submit {
  border-radius: 8px;
  background-color: purple;
  color: white;
  height: 40px;
  padding: 6px 14px;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
}
.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.canvas-area {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-top: 16px;
}
.canvas-wrapper {
  width: 300px;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  transition: transform 260ms ease, opacity 260ms ease;
  opacity: 0.98;
}
.canvas-wrapper.reveal {
  transform: scale(1);
  opacity: 1;
}
.canvas-wrapper.generating {
  transform: scale(0.98);
  opacity: 0.9;
}
.canvas {
  width: 100%;
  height: 100%;
  display: block;
}
.spinner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner::before {
  content: "";
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.6);
  border-top-color: purple;
  animation: spin 900ms linear infinite;
  box-shadow: 0 2px 8px rgba(16, 16, 16, 0.08);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.save-icon {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(16, 16, 16, 0.06);
  color: #333;
  cursor: pointer;
  transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
  box-shadow: 0 2px 6px rgba(16, 16, 16, 0.06);
}
.save-icon:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(16, 16, 16, 0.12);
  background: white;
}
.save-icon:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>
