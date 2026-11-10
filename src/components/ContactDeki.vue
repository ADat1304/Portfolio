<template>
  <section class="relative py-16 md:py-20 overflow-hidden" aria-label="Gặp Deki ở cuối hành trình">
    <div class="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        <!-- Left: Copy & Narrative -->
        <div class="lg:col-span-5 space-y-4">
          <span class="font-mono text-xs text-[#efab72] tracking-widest uppercase">
            HẸN GẶP Ở Ý TƯỞNG TIẾP THEO
          </span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Thêm một người bạn.<br />
            <span class="text-[#efab72] font-serif italic">Thêm một khả năng.</span>
          </h2>
          <p class="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
            Cảm ơn bạn đã ghé thăm không gian số của Đạt và Deki. Dù là một dự án lớn, một ý tưởng nhỏ hay chỉ là lời chào, mình luôn sẵn lòng lắng nghe.
          </p>
          <a
            class="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#efab72] hover:text-[#fbd38d] transition-colors border-b border-[#efab72]/40 pb-1 pt-2"
            href="#contact"
          >
            Cùng trò chuyện nhé ↗
          </a>
        </div>

        <!-- Right: 3D Contact Model Scene Window (Scene 03 / 03) -->
        <div class="lg:col-span-7 relative">
          <div class="relative rounded-2xl border border-white/10 bg-gradient-to-b from-[#121420]/80 to-[#0a0c12]/90 backdrop-blur-md p-4 sm:p-6 shadow-2xl overflow-hidden">
            <div class="flex items-center justify-between pb-3 border-b border-white/5 font-mono text-[9px] text-[#a89b88] tracking-widest uppercase">
              <span class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#efab72]" />
                SEE YOU SOON
              </span>
              <span>SCENE 03 / 03</span>
            </div>

            <!-- Target for Scissor 3D Contact Scene -->
            <div
              data-scene="contact"
              class="scene-window relative w-full h-[320px] sm:h-[380px] cursor-pointer flex items-center justify-center"
              role="img"
              aria-label="Deki đang đợi trò chuyện. Nhấn nhân vật để chào."
            >
              <span class="scene-fallback text-[#efab72] font-mono text-sm">
                [Không gian 3D Deki Contact]
              </span>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-white/5 font-mono text-[10px] text-slate-500">
              <span>Deki đang chờ bạn</span>
              <span class="text-[#efab72]/80">Có ý tưởng gì thú vị không?</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
