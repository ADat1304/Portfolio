<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-vue-next';
import { sound } from '../utils/sound';

const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const soundEnabled = ref(true);

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value;
  sound.enabled = soundEnabled.value;
  if (soundEnabled.value) sound.playPop();
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 40;
};

const navItems = [
  { name: 'Khởi đầu', href: '#hero' },
  { name: '3 Mốc thời gian', href: '#timeline' },
  { name: 'Học vấn & Kỹ năng', href: '#skills' },
  { name: 'Dự án', href: '#projects' },
  { name: 'Liên hệ', href: '#contact' },
];

const scrollToSection = (e: MouseEvent, href: string) => {
  e.preventDefault();
  sound.playClick();
  mobileMenuOpen.value = false;
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'py-3 bg-[#08090d]/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20' : 'py-5 bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        
        <!-- Logo -->
        <a 
          href="#hero" 
          @click="(e) => scrollToSection(e, '#hero')"
          class="group flex items-center gap-2.5 text-white font-bold text-lg tracking-tight"
        >
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div class="w-full h-full bg-[#0d0e15] rounded-[11px] flex items-center justify-center text-cyan-400 font-mono text-sm font-bold">
              Đ
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold tracking-wider text-slate-200 group-hover:text-cyan-400 transition-colors">
              ANH ĐẠT
            </span>
            <span class="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Software Dev
            </span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1 bg-[#12141c]/60 p-1.5 rounded-full border border-white/5 backdrop-blur-sm">
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.href"
            @click="(e) => scrollToSection(e, item.href)"
            class="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-full hover:bg-white/5 transition-all"
          >
            {{ item.name }}
          </a>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-3">
          <!-- Audio feedback toggle -->
          <button 
            @click="toggleSound"
            :title="soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'"
            class="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all text-xs"
          >
            <Volume2 v-if="soundEnabled" class="w-4 h-4 text-cyan-400" />
            <VolumeX v-else class="w-4 h-4 text-slate-500" />
          </button>

          <!-- Contact CTA -->
          <a
            href="#contact"
            @click="(e) => scrollToSection(e, '#contact')"
            class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20 hover:opacity-95 hover:scale-[1.02] transition-all"
          >
            <span>Kết nối</span>
            <ArrowUpRight class="w-3.5 h-3.5" />
          </a>

          <!-- Mobile Hamburger -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 text-slate-300 hover:text-white"
          >
            <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>

      </div>

      <!-- Mobile dropdown -->
      <div 
        v-if="mobileMenuOpen"
        class="md:hidden mt-3 p-4 rounded-2xl bg-[#11131c] border border-white/10 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2"
      >
        <a
          v-for="item in navItems"
          :key="item.name"
          :href="item.href"
          @click="(e) => scrollToSection(e, item.href)"
          class="block px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors"
        >
          {{ item.name }}
        </a>
      </div>

    </div>
  </header>
</template>
