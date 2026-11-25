<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './HeroSection.vue';
import AboutDeki from './AboutDeki.vue';
import { introScroll, introTransition } from '../three/scroll-story';

gsap.registerPlugin(ScrollTrigger);
const root = ref<HTMLElement>();
const hologramProgress = ref(1);
let media: gsap.MatchMedia | undefined;

onMounted(() => {
  media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const element = root.value!;
    introScroll.active = true;
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate: () => {
        const { progress } = introScroll;
        hologramProgress.value = introTransition(progress).hologram;
        element.dataset.scrollProgress = String(progress);
      },
      scrollTrigger: {
        trigger: element,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    timeline.to(introScroll, { progress: 1, duration: 1 }, 0);
    timeline.to('.intro-scroll-hint', { autoAlpha: 0, y: -16, duration: 0.06 }, 0.02);
    timeline.to('.intro-sticky-frame', { backgroundColor: '#09131c', duration: 0.24 }, 0.06);
    timeline.fromTo('.story-about', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.22);
    timeline.fromTo('.about-atmosphere, .about-orbit', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.46);
    timeline.fromTo('.about-caption-holo', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.07 }, 0.65);
    timeline.to('.about-caption-clay', { autoAlpha: 0, duration: 0.07 }, 0.65);
    timeline.to('.about-scroll-caption', { autoAlpha: 0, duration: 0.05 }, 0.83);
    timeline.fromTo('.about-next', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.88);
    timeline.to('.intro-progress-fill', { scaleX: 1, duration: 1 }, 0);
    return () => {
      introScroll.active = false;
      introScroll.progress = 0;
      hologramProgress.value = 1;
      delete element.dataset.scrollProgress;
    };
  }, root.value);
});

onUnmounted(() => media?.revert());
</script>

<template>
  <div id="hero" ref="root" class="scroll-intro">
    <div class="intro-sticky-frame">
      <HeroSection class="intro-workspace" />
      <AboutDeki class="story-about" :hologram-progress="hologramProgress" />
      <div class="intro-progress" aria-hidden="true"><div class="intro-progress-fill" /></div>
    </div>
    <a href="#about" class="intro-scroll-hint">
      <span>Cuộn để khám phá</span><span aria-hidden="true">↓</span>
    </a>
    <div id="about" class="intro-about-anchor" aria-hidden="true" />
  </div>
</template>

<style>
.scroll-intro { position: relative; height: 480svh; }
.intro-sticky-frame { position: sticky; top: 0; height: 100svh; overflow: hidden; }
.intro-sticky-frame .intro-workspace { position: absolute; inset: 0; height: 100%; }
.intro-sticky-frame .story-about { position: absolute; inset: 0; visibility: hidden; }
.intro-scroll-hint { position: fixed; z-index: 13; bottom: 36px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 20px; font: 11px var(--font-mono); letter-spacing: .12em; color: #fff; text-shadow: 0 2px 12px #000; padding: 12px 18px; border: 1px solid #ffffff30; border-radius: 40px; background: #11182760; }
.intro-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #ffffff14; }
.intro-progress-fill { height: 100%; background: #67d9eb; transform: scaleX(0); transform-origin: left; }
.intro-about-anchor { position: absolute; top: 160svh; width: 1px; height: 1px; pointer-events: none; }
@media (max-width: 800px) {
  .scroll-intro { height: 540svh; }
  .intro-about-anchor { top: 180svh; }
}
@media (prefers-reduced-motion: reduce) {
  .scroll-intro { height: auto; }
  .intro-sticky-frame { position: relative; height: auto; overflow: visible; background: #09131c; }
  .intro-sticky-frame .intro-workspace { position: relative; height: 100svh; }
  .intro-sticky-frame .story-about { position: relative; height: 100svh; visibility: visible; }
  .intro-about-anchor { top: 100svh; }
  .intro-scroll-hint, .intro-progress, .about-scroll-caption { display: none; }
}
</style>
