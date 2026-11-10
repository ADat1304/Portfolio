<script setup lang="ts">
import { ref } from 'vue';
import { FolderGit2, ArrowUpRight, Sparkles } from 'lucide-vue-next';
import ProjectModal, { type ProjectDetail } from './ProjectModal.vue';
import { sound } from '../utils/sound';
import NotchSection from './NotchSection.vue';
import Notch from './Notch.vue';
import SlantedBanner from './SlantedBanner.vue';

const selectedProject = ref<ProjectDetail | null>(null);
const isModalOpen = ref(false);

const projects: ProjectDetail[] = [
  {
    id: 'aura-verse',
    title: 'AuraVerse 3D Workstation',
    category: 'Đồ Án Xuất Sắc & Web 3D',
    role: 'Lead Developer',
    year: '2024',
    summary: 'Mô phỏng không gian làm việc số 3D chân thực trên nền web với Three.js, tối ưu chạy mượt mà 60 FPS trên cả thiết bị di động.',
    problem: 'Các trang portfolio 3D thường nặng nề, load lâu và gây giật lag trên máy cấu hình yếu.',
    solution: 'Áp dụng kỹ thuật nướng texture (Bake lighting) trong Blender và dùng Matcap shaders, nén toàn bộ mô hình GLB xuống dưới 1MB.',
    results: [
      'Đạt điểm 10/10 môn Kỹ thuật Đồ họa và Hoạt hình Máy tính.',
      'Thời gian nạp trang dưới 1.5 giây, duy trì 60 FPS ổn định.',
      'Tích hợp điều khiển camera xoay mượt mà theo nhịp cuộn trang.'
    ],
    tags: ['Vue 3', 'Three.js', 'Blender', 'GLSL Shader', 'GSAP'],
    demoUrl: '#',
    githubUrl: 'https://github.com/example/aura-verse',
    featuredImg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0e7490 100%)'
  },
  {
    id: 'edutrack-ai',
    title: 'EduTrack AI — Quản Lý & Dự Đoán Học Tập',
    category: 'Đồ Án Tốt Nghiệp Môn Học',
    role: 'Full-stack Engineer',
    year: '2024',
    summary: 'Nền tảng hỗ trợ sinh viên lập kế hoạch học phần, quản lý GPA thời gian thực và cảnh báo rủi ro học vụ bằng Machine Learning.',
    problem: 'Sinh viên thường gặp khó khăn trong việc tính toán điều kiện tốt nghiệp và phân bổ tín chỉ hợp lý.',
    solution: 'Xây dựng giao diện Vue 3 trực quan với biểu đồ tương tác, backend FastAPI xử lý thuật toán phân tích điểm và đưa ra lộ trình tối ưu.',
    results: [
      'Thử nghiệm thực tế với hơn 800+ sinh viên trong trường Đại học.',
      'Giảm 40% thời gian lên kế hoạch đăng ký môn học của sinh viên.',
      'Điểm A+ Đồ án Hệ thống Thông tin Quản lý.'
    ],
    tags: ['Vue 3', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Chart.js'],
    demoUrl: '#',
    githubUrl: 'https://github.com/example/edutrack-ai',
    featuredImg: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0284c7 100%)'
  },
  {
    id: 'viet-heritage',
    title: 'VietHeritage WebXR — Bảo Tàng Di Sản 3D',
    category: 'Giải Nhì Hackathon Sinh Viên',
    role: 'Frontend & 3D Specialist',
    year: '2023',
    summary: 'Ứng dụng số hóa các di tích lịch sử và hiện vật văn hóa Việt Nam (Trống đồng Đông Sơn, Khuê Văn Các) dưới dạng không gian ảo 3D.',
    problem: 'Thế hệ trẻ ít có cơ hội tiếp cận trực quan với các bảo vật cổ ở xa bảo tàng.',
    solution: 'Dựng lại mô hình 3D tỉ mỉ bằng photogrammetry, nhúng vào Web với công nghệ WebXR hỗ trợ cả máy tính và kính thực tế ảo.',
    results: [
      'Giải Nhì Chung cuộc Cuộc thi Sáng tạo Công nghệ Sinh viên Toàn quốc.',
      'Thu hút hơn 5,000 lượt tham quan trực tuyến trong tuần đầu ra mắt.',
      'Được vinh danh trên bản tin khoa học công nghệ của trường.'
    ],
    tags: ['WebXR', 'Three.js', 'Photogrammetry', 'TypeScript', 'Tailwind'],
    demoUrl: '#',
    githubUrl: 'https://github.com/example/viet-heritage',
    featuredImg: 'linear-gradient(135deg, #701a75 0%, #4c1d95 50%, #1e1b4b 100%)'
  },
  {
    id: 'dev-pulse',
    title: 'DevPulse — Realtime Performance Monitor',
    category: 'Dự Án Mã Nguồn Mở Cá Nhân',
    role: 'Solo Developer',
    year: '2023',
    summary: 'Công cụ giám sát tài nguyên server, latency và tình trạng vi dịch vụ (Microservices) thời gian thực thông qua kết nối WebSocket.',
    problem: 'Các công cụ monitoring hiện nay thường cồng kềnh, cấu hình phức tạp và ngốn tài nguyên máy chủ.',
    solution: 'Viết agent thu thập số liệu siêu nhẹ bằng Go và bảng điều khiển trực quan bằng Vue 3 với độ trễ truyền dữ liệu dưới 50ms.',
    results: [
      'Hơn 600+ Stars trên GitHub cộng đồng mã nguồn mở.',
      'Sử dụng ít hơn 15MB RAM trên server, khởi chạy bằng 1 lệnh Docker.',
      'Áp dụng làm hệ thống giám sát đồ án môn Mạng máy tính.'
    ],
    tags: ['Vue 3', 'Golang', 'WebSocket', 'Docker', 'Redis'],
    demoUrl: '#',
    githubUrl: 'https://github.com/example/dev-pulse',
    featuredImg: 'linear-gradient(135deg, #431407 0%, #7c2d12 50%, #1e293b 100%)'
  }
];

const openProject = (proj: ProjectDetail) => {
  sound.playPop();
  selectedProject.value = proj;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedProject.value = null;
};
</script>

<template>
  <section id="projects" class="relative bg-[#1a1c25] py-20 md:py-28 overflow-hidden">
    <!-- Top Notch Section Transition -->
    <div class="absolute top-0 left-0 right-0">
      <NotchSection color="#242733" size="32px" />
    </div>

    <!-- Ambient Glows -->
    <div class="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] ambient-glow-indigo pointer-events-none -z-10" />

    <div class="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/5">
        <div class="space-y-3 max-w-2xl text-left">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
            <FolderGit2 class="w-3.5 h-3.5" />
            <span>Sản phẩm thực tế & Đồ án học phần</span>
          </div>

          <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Dự Án <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-[#efab72]">Tiêu Biểu</span>
          </h2>

          <p class="text-slate-400 text-sm sm:text-base leading-relaxed">
            Các sản phẩm tôi đã tâm huyết nghiên cứu, thiết kế và lập trình trong quá trình học tập tại trường Đại học.
          </p>
        </div>

        <SlantedBanner copy="Selected Works" variant="orange" rotation="-5deg" size="md" />
      </div>

      <!-- Projects Grid (Preview Cards with Signature Pocket Notch Button) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        
        <div
          v-for="item in projects"
          :key="item.id"
          @click="openProject(item)"
          class="project-card group rounded-3xl p-6 sm:p-7 bg-[#111320] hover:bg-[#141728] border border-white/5 hover:border-[#efab72]/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#efab72]/5 flex flex-col justify-between cursor-pointer relative"
        >
          <div class="space-y-5">
            
            <!-- Graphic Preview Banner with Notch Pocket -->
            <div 
              class="project-image-box w-full h-48 sm:h-56 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.01]"
              :style="{ background: item.featuredImg }"
            >
              <div class="absolute inset-0 bg-black/25"></div>
              
              <!-- Badges -->
              <div class="relative z-10 flex items-center justify-between">
                <span class="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-md border border-white/10">
                  {{ item.category }}
                </span>
                <span class="text-xs font-mono text-white/90 bg-black/40 px-2.5 py-0.5 rounded backdrop-blur-sm">
                  {{ item.year }}
                </span>
              </div>

              <!-- Title inside image -->
              <div class="relative z-10 text-white text-lg sm:text-xl font-bold tracking-tight max-w-[80%] drop-shadow-md">
                {{ item.title }}
              </div>

              <!-- Corner Pocket with Notch & Circular Arrow Button -->
              <div class="pocket-container absolute bottom-0 right-0 z-20">
                <!-- Notch curves surrounding pocket -->
                <div class="pocket-notch-left absolute bottom-0 right-[46px] text-[#111320] group-hover:text-[#141728] transition-colors">
                  <Notch size="14px" />
                </div>
                <div class="pocket-notch-top absolute bottom-[46px] right-0 text-[#111320] group-hover:text-[#141728] transition-colors">
                  <Notch size="14px" />
                </div>

                <!-- Pocket corner base -->
                <div class="pocket-base bg-[#111320] group-hover:bg-[#141728] pl-2.5 pt-2.5 rounded-tl-2xl transition-colors">
                  <div class="w-10 h-10 rounded-full bg-[#efab72] text-[#1a1109] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <ArrowUpRight :size="18" class="group-hover:rotate-45 transition-transform duration-200" />
                  </div>
                </div>
              </div>

            </div>

            <!-- Description -->
            <div class="space-y-2 text-left pt-1">
              <h3 class="text-xl font-bold text-white group-hover:text-[#efab72] transition-colors">
                {{ item.title }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
                {{ item.summary }}
              </p>
            </div>

            <!-- Key Metric snippet -->
            <div class="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-xs text-slate-300">
              <Sparkles class="w-4 h-4 text-[#efab72] shrink-0" />
              <span class="line-clamp-1">{{ item.results[0] }}</span>
            </div>

          </div>

          <!-- Bottom Footer: Tags & Action -->
          <div class="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in item.tags.slice(0, 3)"
                :key="tag"
                class="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white/5 text-slate-400 border border-white/5"
              >
                {{ tag }}
              </span>
              <span v-if="item.tags.length > 3" class="text-[10px] text-slate-500 font-mono self-center">
                +{{ item.tags.length - 3 }}
              </span>
            </div>

            <span class="text-xs font-semibold text-[#efab72] group-hover:underline flex items-center gap-1">
              Xem Case Study &rarr;
            </span>
          </div>

        </div>

      </div>

    </div>

    <!-- Bottom Notch Section Transition -->
    <div class="absolute bottom-0 left-0 right-0">
      <NotchSection color="#242733" size="32px" :inverted="true" />
    </div>

    <!-- Case study detail modal -->
    <ProjectModal
      :project="selectedProject"
      :is-open="isModalOpen"
      @close="closeModal"
    />
  </section>
</template>

<style scoped>
.pocket-notch-left {
  transform: rotate(90deg) scaleY(-1);
}
.pocket-notch-top {
  transform: rotate(90deg) scaleX(-1);
}
</style>
