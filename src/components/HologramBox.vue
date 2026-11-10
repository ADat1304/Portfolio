<script setup lang="ts">
import { useSlots } from 'vue';

withDefaults(
  defineProps<{
    variant?: 'cyan' | 'orange' | 'indigo';
    footer?: boolean;
  }>(),
  {
    variant: 'cyan',
    footer: false,
  }
);

const slots = useSlots();
</script>

<template>
  <div class="hologram-box" :class="`hologram-box-${variant}`">
    <!-- Header Tab with SVG Curve -->
    <div v-if="slots.title" class="hologram-box-header">
      <div class="hologram-box-title">
        <slot name="title" />
      </div>
      <div class="hologram-box-curve">
        <svg viewBox="0 0 51 34" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-7 h-4.5 block">
          <path d="M47.6098 33C24.1951 33 26.5366 1 3.12195 1H0V33H47.6098Z" class="curve-fill" />
          <path
            d="M0 1H3.12195C26.5366 1 24.1951 33 47.6098 33H50.7317"
            vector-effect="non-scaling-stroke"
            class="curve-stroke"
          />
        </svg>
      </div>
      <div class="hologram-box-header-line flex-1" />
    </div>

    <!-- Main Content -->
    <div class="hologram-box-content">
      <slot />
    </div>

    <!-- Optional Sci-Fi Footer Curve -->
    <div v-if="footer" class="hologram-box-footer">
      <svg viewBox="0 0 255 13" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-2.5 block">
        <path
          d="M0.257324 0.428772L14.3995 8.91406C18.1502 11.1645 23.2373 12.4288 28.5416 12.4288H225.973C231.277 12.4288 236.364 11.1645 240.115 8.91405L254.257 0.428772"
          class="footer-stroke"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.hologram-box {
  position: relative;
  width: 100%;
}

.hologram-box-header {
  display: flex;
  align-items: flex-end;
  height: 34px;
}

.hologram-box-title {
  padding: 6px 16px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 700;
  border-top-left-radius: 8px;
  border-top-right-radius: 0;
  border-top: 1.5px solid;
  border-left: 1.5px solid;
  border-right: none;
  border-bottom: none;
}

.hologram-box-curve {
  position: relative;
  line-height: 0;
}

.hologram-box-header-line {
  border-bottom: 1.5px solid;
  height: 100%;
}

.hologram-box-content {
  padding: 24px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-left: 1.5px solid;
  border-right: 1.5px solid;
  border-bottom: 1.5px solid;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.hologram-box-footer {
  margin-top: -1px;
  padding: 0 16px;
}

/* Cyan Variant */
.hologram-box-cyan .hologram-box-title {
  background: rgba(8, 30, 48, 0.85);
  border-color: rgba(56, 189, 248, 0.4);
  color: #7dd3fc;
}
.hologram-box-cyan .curve-fill {
  fill: rgba(8, 30, 48, 0.85);
}
.hologram-box-cyan .curve-stroke,
.hologram-box-cyan .hologram-box-header-line {
  stroke: rgba(56, 189, 248, 0.4);
  border-color: rgba(56, 189, 248, 0.4);
}
.hologram-box-cyan .hologram-box-content {
  border-color: rgba(56, 189, 248, 0.35);
  background: linear-gradient(180deg, rgba(8, 30, 48, 0.75) 0%, rgba(6, 18, 30, 0.85) 100%);
  box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.15);
}
.hologram-box-cyan .footer-stroke {
  stroke: rgba(56, 189, 248, 0.4);
}

/* Orange Variant */
.hologram-box-orange .hologram-box-title {
  background: rgba(38, 24, 15, 0.85);
  border-color: rgba(239, 171, 114, 0.5);
  color: #fbd38d;
}
.hologram-box-orange .curve-fill {
  fill: rgba(38, 24, 15, 0.85);
}
.hologram-box-orange .curve-stroke,
.hologram-box-orange .hologram-box-header-line {
  stroke: rgba(239, 171, 114, 0.5);
  border-color: rgba(239, 171, 114, 0.5);
}
.hologram-box-orange .hologram-box-content {
  border-color: rgba(239, 171, 114, 0.4);
  background: linear-gradient(180deg, rgba(38, 24, 15, 0.75) 0%, rgba(20, 14, 10, 0.85) 100%);
  box-shadow: 0 10px 30px -10px rgba(239, 171, 114, 0.12);
}
.hologram-box-orange .footer-stroke {
  stroke: rgba(239, 171, 114, 0.5);
}
</style>
