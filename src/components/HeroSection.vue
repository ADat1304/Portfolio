<script setup lang="ts">
// Typography and HUD elements removed as requested, providing a full-screen immersive 3D workspace.
</script>

<template>
  <section id="hero" class="relative w-full h-[92vh] sm:h-[95vh] md:h-screen flex items-center justify-center overflow-hidden">
    <!-- Ambient backlight harmonizing with the wall atmosphere -->
    <div class="absolute inset-0 bg-radial from-white/5 to-transparent pointer-events-none -z-10" />

    <!-- Fullscreen 3D Viewport Target -->
    <div
      data-scene="workspace"
      class="scene-window relative w-full h-full cursor-pointer flex items-center justify-center select-none"
      role="img"
      aria-label="Mô hình 3D góc làm việc Deki"
    >
      <span class="scene-fallback sr-only">
        [Không gian 3D Deki's Workspace]
      </span>
    </div>
  </section>
</template>

