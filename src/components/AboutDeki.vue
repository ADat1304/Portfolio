<script setup lang="ts">
import { ArrowDown, ArrowUpRight } from 'lucide-vue-next';

defineProps<{ hologramProgress: number }>();

const profile = [
  { key: 'name', label: 'Họ và tên', value: 'Nguyễn Anh Đạt' },
  { key: 'age', label: 'Tuổi', value: 'Đang cập nhật' },
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

    <footer class="about-footer">
      <p class="about-scroll-caption"><span class="about-caption-clay">Cuộn tiếp để khám phá</span><span class="about-caption-holo">Một chút về mình</span><ArrowDown :size="14" /></p>
      <a class="about-next" href="#timeline">Khám phá hành trình của mình <ArrowUpRight :size="16" /></a>
      <span class="about-scene-label" aria-hidden="true">DEKI / 02</span>
    </footer>
  </section>
</template>

<style scoped>
.deki-about { position: relative; width: 100%; height: 100%; min-height: 560px; color: #eef8f8; overflow: hidden; }
.about-atmosphere { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 58%, #246d852d, transparent 58%); pointer-events: none; }
.about-model { position: absolute; top: 8%; left: 0; width: 100%; height: 80%; cursor: default; }
.about-orbit { position: absolute; top: 81%; left: 50%; width: min(40vw, 500px); height: 72px; transform: translateX(-50%); border: 1px solid #70dfed40; border-radius: 50%; box-shadow: 0 0 32px #54cbe010, inset 0 0 30px #54cbe010; pointer-events: none; }
.about-orbit > span:first-child { position: absolute; inset: 9px 22px; border: 1px dashed #70dfed30; border-radius: 50%; }
.about-orbit > span:last-child { position: absolute; top: 50%; left: 50%; width: 4px; height: 4px; border-radius: 50%; background: #8beaf2; box-shadow: 0 0 20px 5px #70dfed40; }
.about-scan-board { position: absolute; z-index: 14; top: 82%; left: 50%; transform: translate(-50%, -10%); min-width: 176px; padding: 10px 16px 12px; border-radius: 10px; border: 1px solid #70dfed4d; background: linear-gradient(180deg, rgba(8, 25, 38, 0.88) 0%, rgba(5, 14, 24, 0.94) 100%); box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45), 0 0 24px rgba(84, 203, 224, 0.16), inset 0 1px 0 rgba(139, 234, 242, 0.2); backdrop-filter: blur(10px); text-align: center; pointer-events: none; }
.scan-board-top { display: flex; align-items: center; justify-content: center; gap: 7px; margin-bottom: 4px; }
.scan-board-dot { width: 6px; height: 6px; border-radius: 50%; background: #efab72; box-shadow: 0 0 8px #efab7280; transition: background .25s, box-shadow .25s; }
.scan-board-dot.active { background: #38bdf8; box-shadow: 0 0 12px #38bdf8; }
.scan-board-dot.full { background: #4ade80; box-shadow: 0 0 12px #4ade80; }
.scan-board-label { font: 700 9px var(--font-mono); letter-spacing: .16em; color: #87bac3; }
.scan-board-digits { font: 700 clamp(22px, 2.2vw, 30px)/1.05 var(--font-mono); letter-spacing: .08em; color: #e2fbff; text-shadow: 0 0 16px rgba(103, 217, 235, 0.55); }
.scan-board-digits small { font-size: 0.55em; color: #67d9eb; margin-left: 3px; }
.scan-board-bar { margin-top: 7px; width: 100%; height: 3px; border-radius: 999px; background: rgba(112, 223, 237, 0.16); overflow: hidden; }
.scan-board-bar > i { display: block; height: 100%; background: linear-gradient(90deg, #efab72, #38bdf8, #80d6cc); box-shadow: 0 0 10px #67d9eb; transition: width .08s linear; }
.about-facts { position: absolute; z-index: 13; inset: 0; pointer-events: none; }
.about-fact { position: absolute; width: min(25vw, 340px); padding-top: 16px; border-top: 1px solid #74c5d033; }
@media (prefers-reduced-motion: no-preference) {
  .about-fact { transition: opacity 180ms ease-out, transform 180ms ease-out; }
  .about-fact-hidden { visibility: hidden; opacity: 0; transform: translateY(12px); }
}
.about-fact::after { content: ''; position: absolute; top: -3px; width: 5px; height: 5px; background: #80d6cc; border-radius: 50%; box-shadow: 0 0 12px #80d6cc50; }
.about-fact-name, .about-fact-age { left: clamp(32px, 6vw, 110px); }
.about-fact-hometown, .about-fact-education { right: clamp(32px, 6vw, 110px); }
.about-fact-name, .about-fact-hometown { top: 43%; }
.about-fact-age, .about-fact-education { top: 65%; }
.about-fact-name::after, .about-fact-age::after { right: 0; }
.about-fact-hometown::after, .about-fact-education::after { left: 0; }
.about-fact dt { display: flex; align-items: center; gap: 12px; color: #8eb0b9; font: 10px var(--font-mono); text-transform: uppercase; letter-spacing: .15em; }
.about-fact-number { color: #52777f; font-size: 9px; }
.about-fact dd { margin: 13px 0 0; font-size: clamp(19px, 2vw, 29px); line-height: 1.4; font-weight: 500; letter-spacing: -.035em; }
.about-fact-age dd { color: #a0b3bb; font-size: clamp(18px, 1.7vw, 24px); }
.about-fact-detail { display: block; max-width: 290px; margin-top: 7px; font-size: clamp(15px, 1.5vw, 21px); line-height: 1.5; font-weight: 400; letter-spacing: -.02em; color: #b5d5d9; }
.about-footer { position: absolute; z-index: 13; bottom: 37px; left: clamp(24px, 4vw, 64px); right: clamp(24px, 4vw, 64px); display: flex; justify-content: center; align-items: center; min-height: 28px; }
.about-scroll-caption, .about-next { display: flex; align-items: center; gap: 14px; font-size: 11px; color: #9bb5bd; }
.about-scroll-caption { position: absolute; font-family: var(--font-mono); }
.about-caption-holo { position: absolute; left: 0; white-space: nowrap; }
.about-next { color: #b2e9e7; text-decoration: none; padding: 6px 0; border-bottom: 1px solid #80d6cc40; }
.about-next:hover { color: #fff; border-color: #80d6cc; }
.about-scene-label { position: absolute; right: 0; color: #60818a; font: 9px var(--font-mono); letter-spacing: .16em; }
@media (max-width: 800px) {
  .about-model { top: 6%; height: 52%; }
  .about-orbit { top: 55%; width: 62vw; height: 40px; }
  .about-scan-board { top: 56%; min-width: 148px; padding: 7px 12px 9px; }
  .scan-board-digits { font-size: 20px; }
  .about-facts { inset: auto 24px 90px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px 24px; }
  .about-fact { position: relative; top: auto; left: auto; right: auto; width: auto; min-width: 0; padding-top: 12px; }
  .about-fact-name { order: 0; }
  .about-fact-age { order: 1; }
  .about-fact-hometown { order: 2; }
  .about-fact-education { order: 3; }
  .about-fact::after { left: 0; right: auto; }
  .about-fact dt { font-size: 8px; letter-spacing: .1em; gap: 7px; }
  .about-fact dd, .about-fact-age dd { margin-top: 9px; font-size: 17px; }
  .about-fact-detail { font-size: 13px; margin-top: 3px; }
  .about-scene-label { display: none; }
  .about-footer { bottom: 30px; }
}
@media (max-height: 700px) {
  .deki-about { min-height: 0; }
  .about-footer { bottom: 20px; }
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
