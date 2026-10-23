<script setup lang="ts">
import { 
  GraduationCap, Award, CheckCircle2, 
  Cpu, Code2, Database, Wrench 
} from 'lucide-vue-next';
import { sound } from '../utils/sound';

const skillCategories = [
  {
    name: 'Frontend & Web 3D',
    icon: Code2,
    color: 'text-cyan-400',
    skills: [
      { name: 'Vue 3 & TypeScript', level: 90 },
      { name: 'Three.js & WebGL', level: 78 },
      { name: 'Tailwind CSS & SCSS', level: 92 },
      { name: 'GSAP & Lenis Scroll', level: 82 },
      { name: 'HTML5 Semantic & SEO', level: 95 },
    ]
  },
  {
    name: 'Backend & Database',
    icon: Database,
    color: 'text-indigo-400',
    skills: [
      { name: 'Node.js & Express', level: 84 },
      { name: 'Python & FastAPI', level: 80 },
      { name: 'PostgreSQL & MongoDB', level: 78 },
      { name: 'RESTful API & WebSocket', level: 86 },
      { name: 'Redis Caching', level: 70 },
    ]
  },
  {
    name: 'Tools, 3D & DevOps',
    icon: Wrench,
    color: 'text-purple-400',
    skills: [
      { name: 'Git & GitHub Workflow', level: 90 },
      { name: 'Docker & Containerization', level: 75 },
      { name: 'Blender (Low-poly & Bake)', level: 72 },
      { name: 'Figma UI/UX Prototyping', level: 82 },
      { name: 'Linux / Bash Scripting', level: 80 },
    ]
  }
];

const certifications = [
  {
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: '2024',
    badge: 'AWS CLF-C02',
    icon: '☁️'
  },
  {
    title: 'IELTS Academic 7.5',
    issuer: 'IDP Education',
    date: '2023',
    badge: 'C1 Proficient',
    icon: '🌐'
  },
  {
    title: 'Giải Ba Olympic Tin Học Sinh Viên Toàn Quốc',
    issuer: 'Hội Tin học Việt Nam',
    date: '2023',
    badge: 'Chuyên Tin',
    icon: '🏆'
  },
  {
    title: 'Học Bổng Khuyến Khích Học Tập Loại Xuất Sắc',
    issuer: 'Trường Đại học Bách Khoa',
    date: '4 Kỳ liên tiếp',
    badge: 'Top 5% Khoa',
    icon: '🎖️'
  }
];
</script>

<template>
  <section id="skills" class="py-24 relative bg-[#08090d]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Title -->
      <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <GraduationCap class="w-3.5 h-3.5" />
          <span>Nền tảng học thuật & Năng lực thực chiến</span>
        </div>

        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Học Vấn, <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Kỹ Năng</span> & Chứng Chỉ
        </h2>

        <p class="text-slate-400 text-sm sm:text-base leading-relaxed">
          Sự kết hợp giữa tư duy nền tảng vững chắc trong trường Đại học và khả năng tự nghiên cứu, ứng dụng các công nghệ hiện đại vào thực tiễn.
        </p>
      </div>

      <!-- Part 1: University & GPA Showcase Card -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        <!-- Big GPA & University Card (7 cols) -->
        <div class="lg:col-span-7 rounded-3xl p-8 bg-gradient-to-br from-[#121524] to-[#0c0e17] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="space-y-6">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <span class="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">Trường Đại học</span>
                <h3 class="text-xl sm:text-2xl font-bold text-white">Đại Học Bách Khoa Hà Nội (HUST)</h3>
                <p class="text-xs sm:text-sm text-slate-400">Chuyên ngành: <strong class="text-slate-200">Khoa Học Máy Tính (Computer Science)</strong> &bull; Niên khóa: 2022 - 2026</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl font-bold shrink-0">
                🎓
              </div>
            </div>

            <!-- GPA and Rank Callout -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div class="text-xs text-slate-400">Điểm GPA Tích Lũy</div>
                <div class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mt-1">
                  3.82<span class="text-xs text-slate-500 font-normal">/4.0</span>
                </div>
                <div class="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                  <CheckCircle2 class="w-3 h-3" /> Xuất sắc (Top 5%)
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div class="text-xs text-slate-400">Học Bổng Học Tập</div>
                <div class="text-2xl font-extrabold text-white mt-1">4 Kỳ</div>
                <div class="text-[11px] text-indigo-400 mt-1 font-medium">Loại Xuất Sắc liên tiếp</div>
              </div>

              <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div class="text-xs text-slate-400">Đồ Án Môn Học</div>
                <div class="text-2xl font-extrabold text-white mt-1">A & A+</div>
                <div class="text-[11px] text-purple-400 mt-1 font-medium">Điểm tối đa các môn chuyên ngành</div>
              </div>
            </div>

            <!-- Key Academic Highlights -->
            <div class="space-y-2 pt-2 border-t border-white/5">
              <div class="text-xs font-semibold text-slate-300">Dấu ấn tại trường Đại học:</div>
              <ul class="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Trưởng ban Chuyên môn CLB Lập trình Sinh viên (IT Club) - tổ chức workshop về Web & Git.</li>
                <li>Trợ giảng (Teaching Assistant) hỗ trợ thực hành môn Cấu trúc dữ liệu & Giải thuật.</li>
                <li>Nghiên cứu ứng dụng WebGL & Three.js trong trực quan hóa dữ liệu sinh học tại Lab.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Certifications & Honors List (5 cols) -->
        <div class="lg:col-span-5 rounded-3xl p-6 bg-[#0e1018] border border-white/5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <Award class="w-5 h-5 text-indigo-400" />
                <span>Chứng Chỉ & Giải Thưởng</span>
              </h3>
              <span class="text-xs font-mono text-slate-500">4 Mục chính</span>
            </div>

            <div class="space-y-3">
              <div
                v-for="cert in certifications"
                :key="cert.title"
                @mouseenter="sound.playClick(900, 0.02)"
                class="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-3 group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-lg shrink-0">
                    {{ cert.icon }}
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {{ cert.title }}
                    </h4>
                    <p class="text-[11px] text-slate-400">{{ cert.issuer }} &bull; {{ cert.date }}</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 shrink-0">
                  {{ cert.badge }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500 font-mono text-center">
            Tất cả chứng chỉ đều có mã xác thực số / bằng gốc
          </div>
        </div>

      </div>

      <!-- Part 2: Technical Skills Grid -->
      <div class="space-y-6">
        <div class="text-left">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <Cpu class="w-5 h-5 text-cyan-400" />
            <span>Kỹ Năng Chuyên Môn & Công Nghệ Thực Chiến</span>
          </h3>
          <p class="text-xs text-slate-400 mt-1">Được rèn luyện và áp dụng qua nhiều đồ án môn học và dự án cá nhân.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="cat in skillCategories"
            :key="cat.name"
            class="p-6 rounded-3xl bg-[#0f111a] border border-white/5 hover:border-white/15 transition-all space-y-4"
          >
            <div class="flex items-center gap-3 border-b border-white/5 pb-3">
              <component :is="cat.icon" class="w-5 h-5" :class="cat.color" />
              <h4 class="text-sm font-bold text-white">{{ cat.name }}</h4>
            </div>

            <div class="space-y-3.5">
              <div v-for="skill in cat.skills" :key="skill.name" class="space-y-1.5">
                <div class="flex justify-between text-xs font-mono">
                  <span class="text-slate-300">{{ skill.name }}</span>
                  <span class="text-slate-500">{{ skill.level }}%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-1000"
                    :style="{ width: `${skill.level}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
