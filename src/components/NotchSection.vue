<script setup lang="ts">
import Notch from './Notch.vue';

withDefaults(
  defineProps<{
    color?: string;
    inverted?: boolean;
    size?: string;
  }>(),
  {
    color: 'currentColor',
    inverted: false,
  }
);
</script>

<template>
  <div class="notch-section" :class="{ 'notch-section-inverted': inverted }" :style="{ color }">
    <Notch class="notch-left" :size="size" />
    <Notch class="notch-right" :size="size" />
  </div>
</template>

<style scoped>
.notch-section {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
  line-height: 0;
}

.notch-left {
  transform-origin: center center;
}

.notch-right {
  transform: scaleX(-1);
  transform-origin: center center;
}

.notch-section-inverted {
  transform: scaleY(-1);
}
</style>
