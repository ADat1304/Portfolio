<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Lenis from 'lenis';
import Navbar from './components/Navbar.vue';
import HeroSection from './components/HeroSection.vue';
import TimelineSection from './components/TimelineSection.vue';
import SkillsEducationSection from './components/SkillsEducationSection.vue';
import ProjectsSection from './components/ProjectsSection.vue';
import ContactSection from './components/ContactSection.vue';

let lenis: Lenis | null = null;
let rafId: number | null = null;

onMounted(() => {
  // Initialize Lenis smooth scroll
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);
  } catch (err) {
    console.warn('Lenis smooth scroll initialization skipped:', err);
  }
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  lenis?.destroy();
});
</script>

<template>
  <div class="relative min-h-screen bg-[#08090d] text-[#e2e4ed] selection:bg-indigo-500/30 selection:text-indigo-200">
    <!-- Navbar Header -->
    <Navbar />

    <!-- Main Narrative Sections -->
    <main>
      <!-- Scene 1: Hero Workstation Studio -->
      <HeroSection />

      <!-- Scene 2: The 3 Lifelines / Standing Up (Hà Tĩnh - Cấp 3 - Hiện Tại) -->
      <TimelineSection />

      <!-- Scene 3: Academic Excellence, GPA, Skills & Certifications -->
      <SkillsEducationSection />

      <!-- Scene 4: Featured University Case Studies & Projects -->
      <ProjectsSection />

      <!-- Scene 5: Contact, Social, CV Download & Direct Message Form -->
      <ContactSection />
    </main>
  </div>
</template>
