<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import type { Experience } from '../three/experience';

const canvas = ref<HTMLCanvasElement>();
const progress = ref(0);
const ready = ref(false);
const failed = ref(false);
const message = ref('');

const modelStatus = reactive<Record<string, number>>({
  workspace: 0,
  deki: 0,
  pedestal: 0,
});

const modelRows = computed(() => [
  { key: 'workspace', label: 'workspace-animated.glb', desc: 'Không gian làm việc Hero', percent: modelStatus.workspace ?? 0 },
  { key: 'deki', label: 'deki.glb', desc: 'Nhân vật Deki 3D', percent: modelStatus.deki ?? 0 },
  { key: 'pedestal', label: 'pedestal.glb', desc: 'Bệ phóng Hologram', percent: modelStatus.pedestal ?? 0 },
]);

const formattedTotal = computed(() => String(progress.value).padStart(3, '0'));

let experience: Experience | undefined;
let timer: ReturnType<typeof setTimeout>;
let mounted = true;

const notify = (text: string) => {
  message.value = text;
  clearTimeout(timer);
  timer = setTimeout(() => { message.value = ''; }, 3500);
};

onMounted(async () => {
  try {
    const { Experience } = await import('../three/experience');
    if (!mounted) return;
    experience = new Experience(canvas.value!, notify);
    await experience.init((value, items) => {
      if (!mounted) return;
      progress.value = Math.round(value);
      if (items) {
        for (const [k, v] of Object.entries(items)) modelStatus[k] = v;
      } else if (value >= 80) {
        modelStatus.workspace = 100;
        modelStatus.deki = 100;
        modelStatus.pedestal = 100;
      }
    });
    if (mounted) ready.value = true;
  } catch (error) {
    console.error('Deki 3D initialization failed:', error);
    experience?.destroy();
    if (mounted) {
      failed.value = true;
      ready.value = true;
      document.documentElement.classList.add('three-unavailable');
    }
  }
});
onUnmounted(() => {
  mounted = false;
  clearTimeout(timer);
  experience?.destroy();
  document.documentElement.classList.remove('three-unavailable');
});
</script>
<template>
  <canvas ref="canvas" class="deki-canvas" aria-hidden="true" />
  <Transition name="preloader">
    <div v-if="!ready" class="deki-preloader" role="status" aria-live="polite">
      <div class="loader-board">
        <div class="loader-board-header">
          <span class="loader-badge"><i /> DEKI 3D ENGINE</span>
          <span class="loader-phase">{{ progress < 76 ? 'LOADING ASSETS' : 'COMPILING SHADERS' }}</span>
        </div>

        <div class="loader-main-readout">
          <div class="loader-mark">d<span>·</span></div>
          <div class="loader-percent-box">
            <span class="loader-percent-label">TIẾN ĐỘ TẢI MODEL</span>
            <div class="loader-percent-digits">{{ formattedTotal }}<span>%</span></div>
          </div>
        </div>

        <div class="loader-track"><i :style="{ width: `${progress}%` }" /></div>

        <div class="loader-table" aria-label="Bảng chi tiết phần trăm tải từng model">
          <div v-for="item in modelRows" :key="item.key" class="loader-row">
            <div class="loader-row-info">
              <span class="loader-dot" :class="{ done: item.percent >= 100 }" />
              <div>
                <div class="loader-row-name">{{ item.label }}</div>
                <div class="loader-row-desc">{{ item.desc }}</div>
              </div>
            </div>
            <div class="loader-row-meter">
              <div class="loader-mini-bar"><i :style="{ width: `${item.percent}%` }" /></div>
              <span class="loader-row-pct">{{ String(item.percent).padStart(3, '0') }}%</span>
            </div>
          </div>
        </div>

        <div class="loader-board-footer">
          <span class="loader-count">{{ progress < 80 ? 'Đang giải nén Draco & tải mô hình 3D...' : 'Đang biên dịch ánh sáng & shader...' }}</span>
          <button type="button" class="loader-skip" @click="ready = true">Xem nội dung trước →</button>
        </div>
      </div>
    </div>
  </Transition>
  <div v-if="failed" class="deki-status" role="status">Chưa mở được 3D. Bạn vẫn có thể xem nội dung; tải lại trang để thử lại.</div>
  <Transition name="preloader"><div v-if="message" class="deki-toast" role="status">{{ message }}</div></Transition>
</template>
