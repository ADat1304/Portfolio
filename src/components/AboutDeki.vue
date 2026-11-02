<script setup lang="ts">
import { ref } from 'vue';
const holographic = ref(true);
function toggle() {
  holographic.value = !holographic.value;
  window.dispatchEvent(new CustomEvent('deki:hologram', { detail: holographic.value }));
}
</script>
<template>
  <section id="about" class="deki-about">
    <div class="deki-portrait">
      <span class="world-coordinate">MEET DEKI <i>02 / 03</i></span>
      <div data-scene="about" class="scene-window portrait-scene" role="img" aria-label="Deki với kính, ba lô và mái tóc nâu, hiển thị dạng hologram hoặc clay."><span class="scene-fallback">Xin chào, mình là Deki.</span></div>
      <button class="hologram-toggle" :aria-pressed="holographic" @click="toggle"><span :class="{ active: holographic }" /> {{ holographic ? 'Hologram đang bật' : 'Chất liệu clay' }} <span>⇄</span></button>
    </div>
    <div class="about-copy">
      <p class="section-kicker">PHÍA SAU MÀN HÌNH</p>
      <h2>Một chút logic.<br />Một chút <em>mộng mơ.</em></h2>
      <p>Mình là Đạt, một người yêu công nghệ đến từ Hà Tĩnh. Mình thích biến những ý tưởng nhỏ thành trải nghiệm có thể nhìn thấy, chạm vào và khám phá.</p>
      <p>Deki là người bạn đồng hành trong thế giới này: mang theo sự tò mò, một chiếc ba lô và những ý tưởng chưa kịp viết hết.</p>
      <a href="#timeline" class="deki-text-link">Theo dấu hành trình của mình <span>↗</span></a>
      <div class="about-disciplines"><span>Web development</span><span>Interactive 3D</span><span>Creative coding</span></div>
    </div>
  </section>
</template>
