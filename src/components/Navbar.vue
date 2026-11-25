<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-vue-next';
import { sound } from '../utils/sound';

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const soundEnabled = ref(true);
const activeSection = ref<string>('hero');

const navItems = [
  { id: 'hero', name: 'Khởi đầu', href: '#hero' },
  { id: 'about', name: 'Gặp Deki', href: '#about' },
  { id: 'timeline', name: 'Hành trình', href: '#timeline' },
  { id: 'skills', name: 'Kỹ năng', href: '#skills' },
  { id: 'projects', name: 'Dự án', href: '#projects' },
  { id: 'contact', name: 'Liên hệ', href: '#contact' },
];

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value;
  sound.enabled = soundEnabled.value;
  if (soundEnabled.value) sound.playPop();
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 40;

  // Active section detection
  const scrollPosition = window.scrollY + 200;
  for (const item of navItems) {
    const el = document.querySelector(item.href);
    if (el instanceof HTMLElement) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const height = el.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeSection.value = item.id;
      }
    }
  }
  const intro = document.querySelector('.scroll-intro');
  const about = document.getElementById('about');
  if (intro && about && scrollPosition < intro.getBoundingClientRect().bottom + window.scrollY) {
    activeSection.value = scrollPosition >= about.getBoundingClientRect().top + window.scrollY ? 'about' : 'hero';
  }
};

const scrollToSection = (e: MouseEvent, href: string) => {
  sound.playClick();
  mobileMenuOpen.value = false;
  if (href === '#skills') return;
  e.preventDefault();
  if (location.hash === '#skills') {
    // Use a real fragment navigation so the on-demand section collapses.
    location.hash = href;
    return;
  }
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none"
    :class="isScrolled ? 'py-3' : 'py-5'"
  >
    <div class="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between pointer-events-auto">
        
        <!-- Logo -->
        <a
          href="#hero"
          @click="(e) => scrollToSection(e, '#hero')"
          class="group flex items-center gap-3 text-white font-bold tracking-tight select-none"
        >
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f04458] via-[#721625] to-[#ce1739] p-[1.5px] shadow-lg shadow-[#f04458]/15 group-hover:scale-105 transition-transform">
            <div class="w-full h-full bg-[#0a0c12] rounded-[9.5px] flex items-center justify-center text-[#f04458] font-mono text-sm font-bold">
              Đ
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold tracking-wider text-slate-100 group-hover:text-[#f04458] transition-colors">
              ANH ĐẠT
            </span>
            <span class="text-[9px] font-mono text-[#c4c0c4] uppercase tracking-widest">
              Creative Dev / 2026
            </span>
          </div>
        </a>

        <!-- Desktop Navigation with Pill Indicator -->
        <nav class="hidden md:flex items-center gap-1 bg-[#111113]/80 p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.href"
            @click="(e) => scrollToSection(e, item.href)"
            class="relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 select-none"
            :class="
              activeSection === item.id
                ? 'text-[#fff1f3] bg-[#c91f38] border border-[#f04458]/30 shadow-sm'
                : 'text-portfolio-muted hover:text-slate-200 hover:bg-white/5 border border-transparent'
            "
          >
            <span class="relative z-10">{{ item.name }}</span>
          </a>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-2.5">
          <!-- Audio toggle -->
          <button
            @click="toggleSound"
            :title="soundEnabled ? 'Tắt âm thanh tương tác' : 'Bật âm thanh tương tác'"
            class="w-9 h-9 rounded-full flex items-center justify-center bg-[#111113]/80 hover:bg-white/10 text-portfolio-muted hover:text-white border border-white/10 backdrop-blur-md transition-all text-xs"
          >
            <Volume2 v-if="soundEnabled" class="w-4 h-4 text-[#f04458]" />
            <VolumeX v-else class="w-4 h-4 text-slate-500" />
          </button>

          <!-- Contact CTA Button -->
          <a
            href="#contact"
            @click="(e) => scrollToSection(e, '#contact')"
            class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#c91f38] text-[#fff1f3] border border-[#f04458]/40 hover:bg-[#d12340] hover:border-[#f04458]/70 shadow-lg shadow-[#f04458]/10 transition-all hover:scale-[1.02]"
          >
            <span>Kết nối</span>
            <ArrowUpRight class="w-3.5 h-3.5 text-[#f04458]" />
          </a>

          <!-- Mobile Hamburger -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-[#111113]/80 border border-white/10 text-portfolio-muted hover:text-white backdrop-blur-md"
          >
            <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>

      </div>

      <!-- Mobile dropdown -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-3 p-4 rounded-2xl bg-[#111113]/95 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-1.5 pointer-events-auto"
      >
        <a
          v-for="item in navItems"
          :key="item.name"
          :href="item.href"
          @click="(e) => scrollToSection(e, item.href)"
          class="block px-3.5 py-2.5 text-sm rounded-xl transition-all font-medium"
          :class="
            activeSection === item.id
              ? 'text-[#fff1f3] bg-[#c91f38] border border-[#f04458]/30'
              : 'text-portfolio-muted hover:text-[#f04458] hover:bg-white/5'
          "
        >
          {{ item.name }}
        </a>
      </div>

    </div>
  </header>
</template>
