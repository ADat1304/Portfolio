<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: string;
    color?: string;
  }>(),
  {
    size: 'var(--radius-xxl, 36px)',
    color: 'currentColor',
  }
);
</script>

<template>
  <div class="notch" :style="{ width: size, height: size, color }">
    <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <path d="M0 256H256C114.616 256 0 141.385 0 0V256Z" fill="currentColor" />
    </svg>
  </div>
</template>

<style scoped>
.notch {
  aspect-ratio: 1;
  overflow: hidden;
  display: inline-block;
  line-height: 0;
}
.notch svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
