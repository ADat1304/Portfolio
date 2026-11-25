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
    timeline.to('.intro-sticky-frame', { backgroundColor: '#0b0b0d', duration: 0.24 }, 0.06);
    timeline.fromTo('.story-about', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.22);
    timeline.fromTo('.about-atmosphere, .about-orbit', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.46);
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
    <div id="about" class="intro-about-anchor" aria-hidden="true" />
  </div>
</template>

<style>
.scroll-intro { position: relative; height: 480svh; }
.intro-sticky-frame { position: sticky; top: 0; height: 100svh; overflow: hidden; background: #19171a; }
.intro-sticky-frame .intro-workspace { position: absolute; inset: 0; height: 100%; }
.intro-sticky-frame .story-about { position: absolute; inset: 0 20px; width: auto; visibility: hidden; }
.intro-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #ffffff14; }
.intro-progress-fill { height: 100%; background: var(--color-portfolio-glow); transform: scaleX(0); transform-origin: left; }
.intro-about-anchor { position: absolute; top: 160svh; width: 1px; height: 1px; pointer-events: none; }
@media (max-width: 800px) {
  .scroll-intro { height: 540svh; }
  .intro-about-anchor { top: 180svh; }
  .intro-sticky-frame .story-about { inset-inline: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .scroll-intro { height: auto; }
  .intro-sticky-frame { position: relative; height: auto; overflow: visible; background: var(--color-portfolio-base); }
  .intro-sticky-frame .intro-workspace { position: relative; height: 100svh; background: #19171a; }
  .intro-sticky-frame .story-about { position: relative; inset: auto; width: auto; margin-inline: 20px; height: 100svh; visibility: visible; }
  .intro-about-anchor { top: 100svh; }
  .intro-progress { display: none; }
}
@media (prefers-reduced-motion: reduce) and (max-width: 800px) {
  .intro-sticky-frame .story-about { margin-inline: 0; }
}
</style>
