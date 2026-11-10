<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    copy: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'orange' | 'cyan' | 'indigo' | 'dark';
    rotation?: string;
    showDot?: boolean;
  }>(),
  {
    size: 'md',
    variant: 'orange',
    rotation: '-4deg',
    showDot: true,
  }
);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'cyan':
      return 'bg-cyan-950/80 text-cyan-300 border-cyan-400/40 shadow-cyan-900/30';
    case 'indigo':
      return 'bg-indigo-950/80 text-indigo-300 border-indigo-400/40 shadow-indigo-900/30';
    case 'dark':
      return 'bg-[#181a24] text-[#e2e4ed] border-white/10 shadow-black/40';
    case 'orange':
    default:
      return 'bg-[#2a1d13] text-[#f5c69b] border-[#efab72]/50 shadow-[#efab72]/10';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-[10px] tracking-wider py-1 px-2.5 gap-1.5';
    case 'lg':
      return 'text-xs md:text-sm tracking-widest py-2 px-4 gap-2.5';
    case 'md':
    default:
      return 'text-[11px] md:text-xs tracking-wider py-1.5 px-3.5 gap-2';
  }
});
</script>

<template>
  <div
    class="slanted-banner inline-flex items-center font-mono font-semibold uppercase rounded-sm border backdrop-blur-md shadow-lg select-none transition-transform duration-300 hover:rotate-0"
    :class="[variantClasses, sizeClasses]"
    :style="{ transform: `rotate(${rotation})` }"
  >
    <span
      v-if="showDot"
      class="w-1.5 h-1.5 rounded-full animate-pulse"
      :class="variant === 'cyan' ? 'bg-cyan-400' : variant === 'indigo' ? 'bg-indigo-400' : 'bg-[#efab72]'"
    />
    <span>{{ copy }}</span>
  </div>
</template>

<style scoped>
.slanted-banner {
  transform-origin: center center;
  box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.4);
}
</style>
