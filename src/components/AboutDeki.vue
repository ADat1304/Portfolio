<script setup lang="ts">
import { ref } from 'vue';
import HologramBox from './HologramBox.vue';
import SlantedBanner from './SlantedBanner.vue';
import { ArrowUpRight } from 'lucide-vue-next';

const holographic = ref(true);

function toggle() {
  holographic.value = !holographic.value;
  window.dispatchEvent(new CustomEvent('deki:hologram', { detail: holographic.value }));
}

const disciplines = [
  'Interactive 3D Web',
  'Vue 3 & TypeScript',
  'Three.js & GLSL Shaders',
  'Creative Coding',
  'UI/UX Animation',
];
</script>

<template>
  <section id="about" class="relative py-24 md:py-32 overflow-hidden">
    <!-- Subtle background glow -->
    <div class="absolute top-1/2 left-1/3 w-[600px] h-[600px] ambient-glow-cyan pointer-events-none -z-10" />

    <div class="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-white/5">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span class="font-mono text-[10px] tracking-widest text-cyan-400 uppercase">Phía sau màn hình</span>
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-100">
            Gặp Deki & Đạt
          </h2>
        </div>
        <SlantedBanner copy="Hologram / Identity" variant="cyan" rotation="-3deg" size="sm" />
      </div>

      <!-- 12-Column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        <!-- Left: 3D Deki Portrait Window (Cols 1-6) -->
        <div class="lg:col-span-6 relative">
          <div class="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#0b1926]/80 to-[#080d14]/90 backdrop-blur-md p-4 sm:p-6 shadow-2xl overflow-hidden">
            
            <div class="flex items-center justify-between pb-3 border-b border-white/5 font-mono text-[9px] text-cyan-300 tracking-widest uppercase">
              <span class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                MEET DEKI
              </span>
              <span>SCENE 02 / 03</span>
            </div>

            <!-- Target for Scissor 3D Portrait -->
            <div
              data-scene="about"
              class="scene-window relative w-full h-[360px] sm:h-[420px] cursor-pointer flex items-center justify-center"
              role="img"
              aria-label="Deki với kính, ba lô và mái tóc nâu, hiển thị dạng hologram hoặc clay."
            >
              <span class="scene-fallback text-cyan-400 font-mono text-sm">
                [Không gian 3D Deki Hologram]
              </span>
            </div>

            <!-- Toggle Hologram / Clay Mode Button -->
            <div class="pt-4 flex justify-center">
              <button
                class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-mono text-xs text-cyan-300 bg-cyan-950/70 border border-cyan-400/30 hover:border-cyan-400/70 transition-all shadow-lg shadow-cyan-950/50 cursor-pointer hover:scale-105"
                :aria-pressed="holographic"
                @click="toggle"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="holographic ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]' : 'bg-[#efab72] shadow-[0_0_8px_#efab72]'"
                />
                <span>{{ holographic ? 'Hologram Mode: ON' : 'Clay Mode: ON' }}</span>
                <span class="text-cyan-400/50 font-normal">⇄</span>
              </button>
            </div>

          </div>
        </div>

        <!-- Right: Hologram HUD Box Content (Cols 7-12) -->
        <div class="lg:col-span-6 flex flex-col space-y-6">
          <HologramBox variant="cyan" :footer="true">
            <template #title>
              Hồ Sơ Sáng Tạo // Deki
            </template>

            <div class="space-y-4 text-slate-300">
              <h3 class="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                Một chút logic kỹ thuật.<br />
                <span class="text-cyan-300 font-serif italic">Một chút mộng mơ sáng tạo.</span>
              </h3>

              <p class="text-sm sm:text-base leading-relaxed text-slate-300">
                Mình là Đạt, sinh viên ngành Công nghệ Thông tin đến từ Hà Tĩnh. Mình có niềm đam mê đặc biệt với việc biến những dòng code trừu tượng thành các trải nghiệm tương tác 3D sống động, chạm đến cảm xúc người dùng.
              </p>

              <p class="text-sm leading-relaxed text-slate-400">
                <strong>Deki</strong> là người bạn đồng hành ảo trong thế giới này — đại diện cho sự tò mò không ngừng nghỉ, chiếc ba lô mang theo kiến thức và những ý tưởng đang chờ thành hình.
              </p>

              <!-- Disciplines Tags -->
              <div class="pt-4 border-t border-cyan-500/20">
                <span class="font-mono text-[10px] text-cyan-400/70 tracking-widest uppercase block mb-2.5">
                  Lĩnh Vực Chuyên Sâu
                </span>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="item in disciplines"
                    :key="item"
                    class="px-2.5 py-1 rounded-md font-mono text-[11px] bg-cyan-950/50 border border-cyan-400/20 text-cyan-300"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>

              <!-- Next Action Link -->
              <div class="pt-2">
                <a
                  href="#timeline"
                  class="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#efab72] hover:text-[#fbd38d] transition-colors group"
                >
                  <span>Theo dấu 3 mốc hành trình của mình</span>
                  <ArrowUpRight :size="14" class="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </HologramBox>
        </div>

      </div>

    </div>
  </section>
</template>
