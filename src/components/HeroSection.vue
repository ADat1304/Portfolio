<script setup lang="ts">
import { Terminal, Sparkles, MapPin, Compass } from 'lucide-vue-next';
import { sound } from '../utils/sound';

const onScrollDown = () => {
  sound.playWhoosh();
  const nextSection = document.getElementById('timeline');
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <section id="hero" class="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden cyber-grid">
    <!-- Ambient light glow backgrounds -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] ambient-glow-indigo pointer-events-none -z-10"></div>
    <div class="absolute bottom-10 right-10 w-[400px] h-[400px] ambient-glow-cyan pointer-events-none -z-10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left: Information & Call to Action (5 cols) -->
        <div class="lg:col-span-6 space-y-6 text-left">
          
          <!-- Origin Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <MapPin class="w-3.5 h-3.5 text-cyan-400" />
            <span>Hà Tĩnh, Việt Nam &bull; Sẵn sàng cho cơ hội mới</span>
          </div>

          <!-- Main Title -->
          <div class="space-y-2">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Nguyễn <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Anh Đạt</span>
            </h1>
            <p class="text-lg sm:text-xl font-medium text-slate-300">
              Creative Web & Software Engineer
            </p>
          </div>

          <!-- Intro summary -->
          <p class="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
            Chào mừng bạn đến với không gian làm việc của tôi! Một sinh viên công nghệ đam mê tạo ra các trải nghiệm web 3D tương tác sống động, tối ưu hiệu năng và giải quyết bài toán thực tế.
          </p>

          <!-- Core stats pill group -->
          <div class="grid grid-cols-3 gap-3 pt-2">
            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div class="text-xs text-slate-500 font-mono">GPA Đại Học</div>
              <div class="text-lg font-bold text-white mt-0.5">3.82<span class="text-xs text-slate-400">/4.0</span></div>
            </div>
            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div class="text-xs text-slate-500 font-mono">Xuất phát điểm</div>
              <div class="text-lg font-bold text-cyan-400 mt-0.5">Hà Tĩnh</div>
            </div>
            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div class="text-xs text-slate-500 font-mono">Dự án hoàn thành</div>
              <div class="text-lg font-bold text-indigo-400 mt-0.5">10+ App</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-4 pt-3">
            <button
              @click="onScrollDown"
              class="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-semibold text-sm shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Compass class="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span>Khám phá hành trình của tôi</span>
            </button>

            <a
              href="#contact"
              @click="sound.playClick()"
              class="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm border border-white/10 transition-all"
            >
              Liên hệ nhanh
            </a>
          </div>

        </div>

        <!-- Right: 3D Scene 1 - Workstation Studio Simulator (6 cols) -->
        <div class="lg:col-span-6 relative">
          
          <!-- Outer 3D Card / Studio Screen -->
          <div class="relative rounded-3xl p-1 bg-gradient-to-b from-indigo-500/20 via-white/5 to-transparent shadow-2xl">
            <div class="rounded-[22px] bg-[#0d0f17] border border-white/10 overflow-hidden">
              
              <!-- Window top bar -->
              <div class="flex items-center justify-between px-4 py-3 bg-[#131522] border-b border-white/5">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span class="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Terminal class="w-3.5 h-3.5 text-cyan-400" />
                    scene-01_workstation.glb (Working State)
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                    ● Live 60 FPS
                  </span>
                </div>
              </div>

              <!-- Interactive 3D Workstation Visual Simulator -->
              <div class="relative h-[380px] sm:h-[420px] bg-gradient-to-b from-[#111320] to-[#0a0b12] flex items-center justify-center p-6 overflow-hidden">
                
                <!-- Floor grid perspective -->
                <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <!-- 3D Room Workstation Composition (Visual Model Representation) -->
                <div class="relative z-10 w-full max-w-md flex flex-col items-center">
                  
                  <!-- Floating Notification Badge -->
                  <div class="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs floating-element backdrop-blur-md">
                    <Sparkles class="w-3.5 h-3.5 text-cyan-400" />
                    <span>Đạt đang ngồi tại bàn làm việc: "Gõ code & nghiên cứu 3D"</span>
                  </div>

                  <!-- Isometric Desk Setup Simulation Graphic -->
                  <div class="relative w-64 h-52 sm:w-72 sm:h-56 flex items-center justify-center">
                    
                    <!-- Glow beneath desk -->
                    <div class="absolute bottom-4 w-48 h-12 bg-cyan-500/20 rounded-full blur-xl"></div>

                    <!-- Workstation Canvas Mock / Chibi Dev Sitting -->
                    <div class="relative w-full h-full flex flex-col items-center justify-center">
                      
                      <!-- Dual Monitors -->
                      <div class="flex items-end gap-2 mb-2">
                        <!-- Monitor 1 (Code Editor) -->
                        <div class="w-28 h-20 rounded-lg bg-[#181a27] border border-cyan-500/40 p-1.5 shadow-lg shadow-cyan-500/10 flex flex-col justify-between">
                          <div class="flex items-center justify-between border-b border-white/5 pb-1">
                            <span class="text-[8px] font-mono text-cyan-300">App.vue</span>
                            <div class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
                          </div>
                          <div class="space-y-1">
                            <div class="h-1 bg-cyan-400/40 rounded w-4/5"></div>
                            <div class="h-1 bg-indigo-400/40 rounded w-3/5"></div>
                            <div class="h-1 bg-purple-400/40 rounded w-full"></div>
                            <div class="h-1 bg-emerald-400/40 rounded w-2/3"></div>
                          </div>
                          <span class="text-[7px] font-mono text-slate-500 text-right">UTF-8</span>
                        </div>

                        <!-- Monitor 2 (3D Viewport) -->
                        <div class="w-24 h-16 rounded-lg bg-[#151724] border border-indigo-500/40 p-1.5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
                          <div class="w-8 h-8 rounded-full border border-dashed border-cyan-400 animate-spin"></div>
                          <span class="text-[8px] font-mono text-indigo-300 mt-1">WebGL 3D</span>
                        </div>
                      </div>

                      <!-- Desk Surface -->
                      <div class="w-56 sm:w-64 h-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 rounded-sm shadow-md relative">
                        <!-- Keyboard & Mouse -->
                        <div class="absolute -top-1 left-16 w-12 h-1.5 bg-slate-900 rounded-xs border border-white/10"></div>
                        <div class="absolute -top-1 right-20 w-3 h-2 bg-slate-900 rounded-full border border-white/10"></div>
                        <!-- Coffee Mug -->
                        <div class="absolute -top-3 left-6 w-3 h-3 bg-amber-700/80 rounded-xs"></div>
                      </div>

                      <!-- Character Avatar (Seated at desk) -->
                      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <!-- Head / Hair -->
                        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-cyan-300 p-0.5 shadow-md">
                          <div class="w-full h-full rounded-full bg-[#1b1e2e] flex items-center justify-center text-xs font-bold text-white">
                            👨‍💻
                          </div>
                        </div>
                        <!-- Chair & Torso -->
                        <div class="w-12 h-10 bg-slate-800 rounded-t-lg border-t border-slate-700 mt-0.5 flex items-center justify-center">
                          <span class="text-[8px] font-mono text-cyan-400">DEV</span>
                        </div>
                      </div>

                    </div>

                  </div>

                  <!-- Slot model indicator -->
                  <div class="mt-4 px-4 py-2 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm flex items-center justify-between w-full text-xs">
                    <span class="text-slate-400">Model 3D Slot:</span>
                    <span class="font-mono text-cyan-400 font-semibold">[ room-workstation.glb ]</span>
                    <span class="text-[10px] text-slate-500">Sẵn sàng nạp GLB</span>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      <!-- Scroll Indicator with hint to Scene 2 -->
      <div class="mt-12 text-center">
        <button
          @click="onScrollDown"
          class="inline-flex flex-col items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group cursor-pointer"
        >
          <span class="text-xs font-mono uppercase tracking-widest text-slate-500 group-hover:text-cyan-400">
            Cuộn xuống để xem tôi đứng dậy & bước qua 3 mốc thời gian
          </span>
          <div class="w-7 h-10 rounded-full border border-slate-700 group-hover:border-cyan-400 flex items-start justify-center p-1.5 transition-colors">
            <div class="w-1.5 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
          </div>
        </button>
      </div>

    </div>
  </section>
</template>
