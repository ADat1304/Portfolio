<script setup lang="ts">
import { ref } from 'vue';
import { MapPin, Sparkles, Layers, RotateCw } from 'lucide-vue-next';
import { sound } from '../utils/sound';

interface TimelineItem {
  id: string;
  stage: string;
  period: string;
  location: string;
  title: string;
  description: string;
  highlight: string;
  quote: string;
  tags: string[];
  modelFile: string;
  avatarIcon: string;
  color: string;
  accentClass: string;
}

const activeIndex = ref(2); // Default to "Hiện tại" or view all

const timelineData: TimelineItem[] = [
  {
    id: 'countryside',
    stage: 'Mốc 1: Khởi nguồn',
    period: 'Thời thơ ấu - THCS',
    location: 'Hà Tĩnh, Việt Nam',
    title: 'Cội Nguồn & Chiếc Máy Tính Đầu Tiên',
    description: 'Sinh ra và lớn lên trên mảnh đất Hà Tĩnh giàu truyền thống hiếu học và vượt khó. Những buổi trưa hè say sưa bên chiếc máy tính bàn cũ dùng chip Pentium là nơi nhen nhóm ngọn lửa đam mê đầu tiên với thế giới số.',
    highlight: 'Dòng lệnh đầu tiên in ra "Hello World!" và niềm say mê tìm hiểu máy móc vận hành.',
    quote: '"Quê hương Hà Tĩnh cho tôi đức tính kiên trì, chịu khó và không bao giờ bỏ cuộc trước bài toán khó."',
    tags: ['Cội nguồn', 'Đất học Hà Tĩnh', 'Tò mò công nghệ', 'Máy tính cũ'],
    modelFile: 'avatar-countryside.glb',
    avatarIcon: '🌱',
    color: '#38bdf8',
    accentClass: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
  },
  {
    id: 'highschool',
    stage: 'Mốc 2: Định hình',
    period: '2019 - 2022 (Cấp 3)',
    location: 'Hà Tĩnh',
    title: 'Thời Áo Trắng & Thuật Toán Đầu Đời',
    description: 'Những năm tháng học cấp 3 tại trường THPT là bước ngoặt quyết định. Gia nhập đội tuyển Tin học, thức trắng đêm cùng các bài toán quy hoạch động, đồ thị trên nền tảng C++ và Pascal.',
    highlight: 'Đạt Giải Nhì Học sinh Giỏi cấp Tỉnh môn Tin học, nuôi ước mơ trở thành Kỹ sư Phần mềm.',
    quote: '"Lập trình không chỉ là gõ mã, mà là nghệ thuật biến tư duy logic thành giải pháp."',
    tags: ['Đội tuyển Tin học', 'C/C++', 'Giải Nhì HSG Tỉnh', 'Olympic Tin học'],
    modelFile: 'avatar-highschool.glb',
    avatarIcon: '🎒',
    color: '#818cf8',
    accentClass: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 text-indigo-400',
  },
  {
    id: 'present',
    stage: 'Mốc 3: Hiện tại',
    period: '2022 - Nay (Đại học)',
    location: 'Hà Nội & Toàn cầu',
    title: 'Kỹ Sư Phần Mềm & Khát Vọng Web 3D',
    description: 'Hiện là sinh viên chuyên ngành Khoa học Máy tính / CNTT với GPA 3.82/4.0. Không ngừng học hỏi công nghệ mới: kiến trúc Web 3D (Three.js), Full-stack hiện đại và xây dựng các sản phẩm thực chiến.',
    highlight: 'Top 5% sinh viên xuất sắc, hoàn thành nhiều dự án thực tế và đồ án điểm A+.',
    quote: '"Tôi muốn tạo ra những sản phẩm web có chiều sâu, tương tác sống động và mang lại giá trị thực tế."',
    tags: ['Fullstack Dev', 'Three.js / WebGL', 'GPA 3.82/4.0', 'Sẵn sàng việc làm'],
    modelFile: 'avatar-present.glb',
    avatarIcon: '⚡',
    color: '#c084fc',
    accentClass: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
  },
];

const selectStage = (index: number) => {
  activeIndex.value = index;
  sound.playClick(700 + index * 100);
};
</script>

<template>
  <section id="timeline" class="py-24 relative overflow-hidden bg-[#0a0b10] border-t border-b border-white/5">
    <!-- Ambient backdrops -->
    <div class="absolute top-1/2 left-0 w-96 h-96 ambient-glow-cyan pointer-events-none -z-10"></div>
    <div class="absolute top-1/3 right-0 w-96 h-96 ambient-glow-purple pointer-events-none -z-10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto space-y-4">
        
        <!-- Transition narration badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
          <Sparkles class="w-3.5 h-3.5 text-cyan-400" />
          <span>Chuyển cảnh: Đạt đứng dậy & bước qua 3 mốc thời gian</span>
        </div>

        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Hành Trình <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Trưởng Thành</span>
        </h2>

        <p class="text-slate-400 text-sm sm:text-base leading-relaxed">
          Mỗi mốc thời gian đại diện cho một bước chuyển mình của tôi: từ cậu bé hiếu học nơi đất mẹ Hà Tĩnh, đến nam sinh say mê thuật toán cấp 3, và phiên bản kỹ sư công nghệ sẵn sàng bứt phá hôm nay.
        </p>

        <!-- Tab switches for interactive inspection -->
        <div class="flex items-center justify-center gap-2 pt-2">
          <button
            v-for="(item, idx) in timelineData"
            :key="item.id"
            @click="selectStage(idx)"
            class="px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
            :class="activeIndex === idx 
              ? 'bg-white/10 text-white border border-white/20 shadow-lg' 
              : 'bg-transparent text-slate-400 hover:text-white border border-transparent'"
          >
            <span>{{ item.avatarIcon }}</span>
            <span class="hidden sm:inline">{{ item.stage }}</span>
          </button>
        </div>

      </div>

      <!-- 3 Columns - 3 Model Pedestals representing the 3 versions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        
        <div
          v-for="(item, idx) in timelineData"
          :key="item.id"
          @click="selectStage(idx)"
          class="group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          :class="[
            activeIndex === idx 
              ? 'bg-[#121420] border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/15 scale-[1.02]' 
              : 'bg-[#0e1017] border border-white/5 hover:border-white/20 hover:bg-[#11131c]'
          ]"
        >
          <!-- Top badge -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-mono font-bold tracking-wider px-2.5 py-1 rounded-md" :class="item.accentClass">
              {{ item.period }}
            </span>
            <div class="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <MapPin class="w-3 h-3 text-cyan-400" />
              <span>{{ item.location }}</span>
            </div>
          </div>

          <!-- 3D Model Placeholder Pedestal Stage -->
          <div class="my-3 relative rounded-2xl bg-gradient-to-b from-black/40 to-[#07080d] border border-white/5 p-4 flex flex-col items-center justify-center min-h-[220px] overflow-hidden group-hover:border-white/15 transition-all">
            
            <!-- Floor pedestal disk -->
            <div 
              class="absolute bottom-4 w-32 h-10 rounded-full blur-xs opacity-60 transition-opacity"
              :style="{ background: `radial-gradient(circle, ${item.color} 0%, transparent 70%)` }"
            ></div>
            <div class="absolute bottom-6 w-28 h-6 rounded-full border border-dashed border-white/20"></div>

            <!-- Avatar visual representation -->
            <div class="relative z-10 flex flex-col items-center">
              
              <!-- Character Hologram / Avatar Icon -->
              <div 
                class="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-xl floating-element border border-white/10"
                :class="activeIndex === idx ? 'bg-gradient-to-b from-white/10 to-transparent' : 'bg-white/5'"
              >
                {{ item.avatarIcon }}
              </div>

              <!-- Model Filename & Status -->
              <div class="mt-3 text-center">
                <span class="font-mono text-[11px] font-semibold text-slate-200">
                  {{ item.modelFile }}
                </span>
                <div class="text-[9px] font-mono text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                  <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: item.color }"></span>
                  <span>Model Slot: {{ item.id }}</span>
                </div>
              </div>

            </div>

            <!-- 360 inspect button simulator -->
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-white/10 text-slate-300 flex items-center gap-1">
                <RotateCw class="w-2.5 h-2.5" /> 3D View
              </span>
            </div>

          </div>

          <!-- Text Information -->
          <div class="space-y-3 mt-2 flex-grow flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {{ item.title }}
              </h3>
              <p class="text-xs text-slate-400 mt-2 leading-relaxed">
                {{ item.description }}
              </p>
            </div>

            <!-- Quote or Highlight -->
            <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 italic">
              {{ item.quote }}
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 pt-2">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-slate-400 border border-white/5"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

        </div>

      </div>

      <!-- Narrative Summary Callout -->
      <div class="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-cyan-950/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Layers class="w-5 h-5" />
          </div>
          <div>
            <div class="text-sm font-semibold text-white">Cấu trúc 3D đã sẵn sàng để gắn Model GLB</div>
            <div class="text-xs text-slate-400">Các vị trí Model và Animation chuyển đổi góc nhìn theo nhịp cuộn trang đã được thiết lập.</div>
          </div>
        </div>
        <a
          href="#skills"
          @click="sound.playClick()"
          class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white border border-white/10 shrink-0 transition-all"
        >
          Xem Kỹ Năng & Điểm Số &darr;
        </a>
      </div>

    </div>
  </section>
</template>
