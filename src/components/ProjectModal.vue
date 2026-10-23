<script setup lang="ts">
import { X, ExternalLink, Github, CheckCircle } from 'lucide-vue-next';
import { sound } from '../utils/sound';

export interface ProjectDetail {
  id: string;
  title: string;
  category: string;
  role: string;
  year: string;
  summary: string;
  problem: string;
  solution: string;
  results: string[];
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featuredImg: string;
}

const props = defineProps<{
  project: ProjectDetail | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const close = () => {
  sound.playClick(400);
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && project"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md transition-all animate-in fade-in"
      @click.self="close"
    >
      <div 
        class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f111a] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6"
      >
        <!-- Close button -->
        <button
          @click="close"
          class="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center border border-white/5 transition-all cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Header -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              {{ project.category }}
            </span>
            <span class="text-xs text-slate-500 font-mono">{{ project.year }} &bull; Vai trò: {{ project.role }}</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-white">
            {{ project.title }}
          </h3>
          <p class="text-slate-400 text-sm leading-relaxed">
            {{ project.summary }}
          </p>
        </div>

        <!-- Problem & Solution -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div class="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Bài toán thực tế</div>
            <p class="text-xs text-slate-300 leading-relaxed">{{ project.problem }}</p>
          </div>
          <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Giải pháp thực hiện</div>
            <p class="text-xs text-slate-300 leading-relaxed">{{ project.solution }}</p>
          </div>
        </div>

        <!-- Key Results -->
        <div class="space-y-3">
          <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Kết quả & Thành tựu nổi bật:</h4>
          <ul class="space-y-2">
            <li
              v-for="res in project.results"
              :key="res"
              class="flex items-start gap-2.5 text-xs text-slate-300"
            >
              <CheckCircle class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{{ res }}</span>
            </li>
          </ul>
        </div>

        <!-- Tech Tags -->
        <div class="space-y-2 pt-2 border-t border-white/5">
          <div class="text-[11px] font-mono text-slate-500">Công nghệ áp dụng:</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 text-slate-300 border border-white/5"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Links -->
        <div class="flex items-center gap-3 pt-3 border-t border-white/5">
          <a
            v-if="project.demoUrl"
            :href="project.demoUrl"
            target="_blank"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all"
          >
            <span>Trải nghiệm Demo</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
          <a
            v-if="project.githubUrl"
            :href="project.githubUrl"
            target="_blank"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-xs border border-white/10 transition-all"
          >
            <Github class="w-3.5 h-3.5" />
            <span>Mã nguồn GitHub</span>
          </a>
        </div>

      </div>
    </div>
  </Teleport>
</template>
