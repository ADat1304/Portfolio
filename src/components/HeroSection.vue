<script setup lang="ts">
import { ArrowDown, ArrowUpRight } from 'lucide-vue-next';
</script>
<template>
  <section id="hero" class="deki-hero">
    <div class="hero-eyebrow"><span class="status-dot" /> HÀ TĨNH, VIỆT NAM <span class="eyebrow-divider">/</span> CREATIVE DEVELOPER</div>
    <div class="hero-composition">
      <div class="hero-copy">
        <p class="hero-greeting">Xin chào, mình là</p>
        <h1>Nguyễn<br />Anh <span>Đạt.</span></h1>
        <p class="hero-description">Viết code bằng sự tò mò.<br />Tạo trải nghiệm bằng trí tưởng tượng.</p>
        <a class="deki-primary" href="#projects">Khám phá dự án <ArrowUpRight :size="18" /></a>
        <div class="hero-signature"><span class="signature-line" /> Một góc nhỏ, những ý tưởng lớn.</div>
      </div>
      <div class="hero-world">
        <span class="world-coordinate">DEKI’S WORKSPACE <i>01 / 03</i></span>
        <div data-scene="workspace" class="scene-window hero-scene" role="img" aria-label="Mô hình 3D góc làm việc Deki. Nhấn màn hình máy tính để xem dự án."><span class="scene-fallback">Không gian làm việc của Deki</span></div>
        <div class="scene-caption"><span class="status-dot" /> Một ngày ở góc làm việc <span>Di chuột để khám phá ↗</span></div>
        <a href="#projects" class="scene-accessible">Mở dự án từ màn hình của Deki →</a>
      </div>
    </div>
    <div class="hero-baseline"><a href="#about">Cuộn để gặp Deki <ArrowDown :size="15" /></a><span>CODE · CRAFT · CURIOSITY</span><span>PORTFOLIO / 2026</span></div>
  </section>
</template>
