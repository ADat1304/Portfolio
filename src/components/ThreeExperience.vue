<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Experience } from '../three/experience';
const canvas = ref<HTMLCanvasElement>();
const progress = ref(0);
const ready = ref(false);
const failed = ref(false);
const message = ref('');
let experience: Experience | undefined;
let timer: ReturnType<typeof setTimeout>;
let mounted = true;
const notify = (text: string) => {
  message.value = text;
  clearTimeout(timer);
  timer = setTimeout(() => { message.value = ''; }, 3500);
};
const toggleHologram = (event: Event) => {
  if (experience) experience.holographic = (event as CustomEvent<boolean>).detail;
};
onMounted(async () => {
  window.addEventListener('deki:hologram', toggleHologram);
  try {
    const { Experience } = await import('../three/experience');
    if (!mounted) return;
    experience = new Experience(canvas.value!, notify);
    await experience.init(value => { if (mounted) progress.value = Math.round(value); });
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
  window.removeEventListener('deki:hologram', toggleHologram);
  document.documentElement.classList.remove('three-unavailable');
});
</script>
<template>
  <canvas ref="canvas" class="deki-canvas" aria-hidden="true" />
  <Transition name="preloader">
    <div v-if="!ready" class="deki-preloader" role="status" aria-live="polite">
      <span class="loader-mark">d<span>·</span></span>
      <p>Đang mở không gian của Đạt</p>
      <div class="loader-track"><i :style="{ width: `${progress}%` }" /></div>
      <span class="loader-count">{{ progress < 80 ? 'Đang tải mô hình' : 'Chuẩn bị ánh sáng & hiệu ứng' }} · {{ progress }}%</span>
      <button type="button" class="loader-skip" @click="ready = true">Xem nội dung trước →</button>
    </div>
  </Transition>
  <div v-if="failed" class="deki-status" role="status">Chưa mở được 3D. Bạn vẫn có thể xem nội dung; tải lại trang để thử lại.</div>
  <Transition name="preloader"><div v-if="message" class="deki-toast" role="status">{{ message }}</div></Transition>
</template>
