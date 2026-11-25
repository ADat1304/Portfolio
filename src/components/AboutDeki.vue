<script setup lang="ts">
defineProps<{ hologramProgress: number }>();

const profile = [
  { key: 'name', label: 'Họ và tên', value: 'Nguyễn Anh Đạt' },
  { key: 'age', label: 'Tuổi', value: '22 Tuổi' },
  { key: 'hometown', label: 'Quê quán', value: 'Hà Tĩnh, Việt Nam' },
  { key: 'education', label: 'Hiện tại', value: 'Sinh viên', detail: 'Đại học Công nghiệp Hà Nội' },
];
</script>

<template>
  <section class="deki-about" aria-label="Gặp Deki">
    <div class="about-atmosphere" aria-hidden="true" />

    <div class="about-orbit" aria-hidden="true"><span /><span /></div>
    <div
      data-scene="about"
      class="scene-window about-model"
      role="img"
      aria-label="Deki đứng T-pose ở giữa màn hình, chuyển dần từ màu tự nhiên sang hologram xanh khi cuộn."
    >
      <span class="scene-fallback">Deki · Người bạn đồng hành của Đạt</span>
    </div>

    <dl class="about-facts" aria-label="Thông tin về Nguyễn Anh Đạt">
      <div
        v-for="(item, index) in profile"
        :key="item.key"
        class="about-fact"
        :class="['about-fact-' + item.key, { 'about-fact-hidden': hologramProgress < (index + 1) / profile.length }]"
      >
        <dt><span class="about-fact-number">0{{ index + 1 }}</span>{{ item.label }}</dt>
        <dd>{{ item.value }}<span v-if="item.detail" class="about-fact-detail">{{ item.detail }}</span></dd>
      </div>
    </dl>

  </section>
</template>

<style scoped>
.deki-about { position: relative; width: 100%; height: 100%; min-height: 560px; color: var(--color-portfolio-ink); overflow: hidden; }
.about-atmosphere { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 58%, #35151d2d, transparent 58%); pointer-events: none; }
.about-model { position: absolute; top: 3%; left: 0; width: 100%; height: 91%; cursor: default; }
.about-orbit { position: absolute; top: 84%; left: 50%; width: min(42vw, 520px); height: 74px; transform: translateX(-50%); border: 1px solid #f0445840; border-radius: 98px; box-shadow: 0 0 32px #f044580f, inset 0 0 30px #f044580f; pointer-events: none; }
.about-orbit > span:first-child { position: absolute; inset: 9px 22px; border: 1px dashed #f0445830; border-radius: inherit; }
.about-orbit > span:last-child { position: absolute; top: 50%; left: 50%; width: 4px; height: 4px; border-radius: 50%; background: var(--color-portfolio-glow); box-shadow: 0 0 20px #f0445840; }
.about-facts { position: absolute; z-index: 13; inset: 0; pointer-events: none; }
.about-fact { position: absolute; width: min(25vw, 340px); padding-top: 16px; border-top: 1px solid #f0445833; }
@media (prefers-reduced-motion: no-preference) {
  .about-fact { transition: opacity 180ms ease-out, transform 180ms ease-out; }
  .about-fact-hidden { visibility: hidden; opacity: 0; transform: translateY(12px); }
}
.about-fact::after { content: ''; position: absolute; top: -3px; width: 5px; height: 5px; background: var(--color-portfolio-glow); border-radius: 50%; box-shadow: 0 0 12px #f0445850; }
.about-fact-name, .about-fact-age { left: clamp(32px, 6vw, 110px); }
.about-fact-hometown, .about-fact-education { right: clamp(32px, 6vw, 110px); }
.about-fact-name, .about-fact-hometown { top: 43%; }
.about-fact-age, .about-fact-education { top: 65%; }
.about-fact-name::after, .about-fact-age::after { right: 0; }
.about-fact-hometown::after, .about-fact-education::after { left: 0; }
.about-fact dt { display: flex; align-items: center; gap: 12px; color: var(--color-portfolio-muted); font: 10px var(--font-mono); text-transform: uppercase; letter-spacing: .15em; }
.about-fact-number { color: var(--color-portfolio-subtle); font-size: 9px; }
.about-fact dd { margin: 13px 0 0; font-size: clamp(19px, 2vw, 29px); line-height: 1.4; font-weight: 500; letter-spacing: -.035em; }
.about-fact-age { background: #ff334a1a; }
.about-fact-age dd { color: var(--color-portfolio-muted); font-size: clamp(18px, 1.7vw, 24px); }
.about-fact-detail { display: block; max-width: 290px; margin-top: 7px; font-size: clamp(15px, 1.5vw, 21px); line-height: 1.5; font-weight: 400; letter-spacing: -.02em; color: var(--color-portfolio-muted); }
@media (max-width: 800px) {
  .about-model { top: 4%; height: 60%; }
  .about-orbit { top: 58%; width: 62vw; height: 40px; }
  .about-facts { inset: auto 24px 72px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px 24px; }
  .about-fact { position: relative; top: auto; left: auto; right: auto; width: auto; min-width: 0; padding-top: 12px; }
  .about-fact-name { order: 0; }
  .about-fact-age { order: 1; }
  .about-fact-hometown { order: 2; }
  .about-fact-education { order: 3; }
  .about-fact::after { left: 0; right: auto; }
  .about-fact dt { font-size: 8px; letter-spacing: .1em; gap: 7px; }
  .about-fact dd, .about-fact-age dd { margin-top: 9px; font-size: 17px; }
  .about-fact-detail { font-size: 13px; margin-top: 3px; }
}
@media (max-height: 700px) {
  .deki-about { min-height: 0; }
  .about-fact { padding-top: 10px; }
  .about-fact dd { font-size: 19px; margin-top: 8px; }
  .about-fact-detail { font-size: 14px; }
}
@media (max-width: 800px) and (max-height: 700px) {
  .about-model { top: 8%; height: 48%; }
  .about-orbit { top: 52%; }
  .about-facts { bottom: 70px; gap: 12px 18px; }
  .about-fact dd, .about-fact-age dd { font-size: 15px; }
  .about-fact-detail { font-size: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .deki-about { min-height: 900px; }
}
</style>
