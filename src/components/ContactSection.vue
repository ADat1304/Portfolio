<script setup lang="ts">
import { ref } from 'vue';
import { 
  Mail, Phone, MapPin, Send, Check, Copy, 
  Github, Linkedin, Download, Sparkles 
} from 'lucide-vue-next';
import { sound } from '../utils/sound';

const copied = ref(false);
const isSubmitting = ref(false);
const formSubmitted = ref(false);

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const copyEmail = () => {
  sound.playPop();
  navigator.clipboard.writeText('anhdat.nguyen.dev@gmail.com');
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2500);
};

const handleDownloadCV = () => {
  sound.playClick();
  alert('Đã kích hoạt tải về CV của Nguyễn Anh Đạt (File mẫu PDF). Bạn có thể thay đổi đường dẫn file CV thật tại đây.');
};

const submitForm = () => {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    alert('Vui lòng điền đầy đủ các thông tin cần thiết.');
    return;
  }
  sound.playWhoosh();
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    formSubmitted.value = true;
    formData.value = { name: '', email: '', subject: '', message: '' };
  }, 1000);
};
</script>

<template>
  <section id="contact" class="py-24 relative bg-[#07080c] overflow-hidden">
    <!-- Ambient glow -->
    <div class="absolute top-1/2 right-1/4 w-[600px] h-[600px] ambient-glow-cyan pointer-events-none -z-10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <Mail class="w-3.5 h-3.5" />
          <span>Sẵn sàng kết nối & hợp tác</span>
        </div>

        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Liên Hệ & <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Kết Nối</span>
        </h2>

        <p class="text-slate-400 text-sm sm:text-base leading-relaxed">
          Bạn đang có dự án thú vị, cơ hội thực tập / việc làm hay đơn giản muốn trò chuyện về công nghệ và Web 3D? Hãy để lại lời nhắn cho tôi nhé!
        </p>
      </div>

      <!-- Content Grid: Left Contact Info (5 cols) | Right Interactive Form (7 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left Contact Cards -->
        <div class="lg:col-span-5 space-y-6 text-left">
          
          <div class="p-8 rounded-3xl bg-[#0f111a] border border-white/10 space-y-6 shadow-2xl">
            <div class="space-y-1">
              <span class="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">Thông tin trực tiếp</span>
              <h3 class="text-2xl font-bold text-white">Nguyễn Anh Đạt</h3>
              <p class="text-xs text-slate-400">Sinh viên Khoa học Máy tính &bull; Kỹ sư phần mềm tương lai</p>
            </div>

            <div class="space-y-4 pt-2">
              <!-- Location -->
              <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <MapPin class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-[11px] font-mono text-slate-500">Quê quán / Hiện tại:</div>
                  <div class="text-sm font-semibold text-slate-200">Hà Tĩnh / Hà Nội, Việt Nam</div>
                </div>
              </div>

              <!-- Email with copy -->
              <div class="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div class="flex items-center gap-3.5 overflow-hidden">
                  <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Mail class="w-4 h-4" />
                  </div>
                  <div class="truncate">
                    <div class="text-[11px] font-mono text-slate-500">Email:</div>
                    <div class="text-xs sm:text-sm font-semibold text-slate-200 truncate">anhdat.nguyen.dev@gmail.com</div>
                  </div>
                </div>

                <button
                  @click="copyEmail"
                  :title="copied ? 'Đã sao chép' : 'Sao chép email'"
                  class="px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ml-2"
                  :class="copied ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'"
                >
                  <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copied ? 'Đã copy' : 'Copy' }}</span>
                </button>
              </div>

              <!-- Phone -->
              <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Phone class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-[11px] font-mono text-slate-500">Số điện thoại:</div>
                  <div class="text-sm font-semibold text-slate-200">(+84) 987 654 321</div>
                </div>
              </div>
            </div>

            <!-- Social Links & Resume Download -->
            <div class="pt-4 border-t border-white/5 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-all"
              >
                <Github class="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-all"
              >
                <Linkedin class="w-4 h-4 text-cyan-400" />
                <span>LinkedIn</span>
              </a>
              <button
                @click="handleDownloadCV"
                class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all cursor-pointer ml-auto"
              >
                <Download class="w-3.5 h-3.5" />
                <span>Tải CV (PDF)</span>
              </button>
            </div>

          </div>

          <!-- 3D Model Contact Anchor hint -->
          <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-slate-400">
            <Sparkles class="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Màn 5 kết nối với model 3D: <code>avatar-contact.glb</code> (Tư thế chào tạm biệt & kết nối).</span>
          </div>

        </div>

        <!-- Right Message Form -->
        <div class="lg:col-span-7">
          <div class="p-8 rounded-3xl bg-[#0f111a] border border-white/10 shadow-2xl text-left relative">
            
            <div v-if="formSubmitted" class="py-12 text-center space-y-4">
              <div class="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Check class="w-8 h-8" />
              </div>
              <h4 class="text-2xl font-bold text-white">Cảm ơn bạn đã gửi lời nhắn!</h4>
              <p class="text-sm text-slate-400 max-w-md mx-auto">
                Tin nhắn của bạn đã được tiếp nhận. Đạt sẽ phản hồi qua email trong thời gian sớm nhất có thể.
              </p>
              <button
                @click="formSubmitted = false"
                class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Gửi tin nhắn khác
              </button>
            </div>

            <form v-else @submit.prevent="submitForm" class="space-y-4">
              <div class="space-y-1 mb-2">
                <h3 class="text-xl font-bold text-white">Gửi Lời Nhắn Trực Tiếp</h3>
                <p class="text-xs text-slate-400">Tôi luôn kiểm tra email và phản hồi trong vòng 24 giờ.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-mono text-slate-300">Họ và tên *</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    class="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-mono text-slate-300">Địa chỉ Email *</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    placeholder="email@domain.com"
                    class="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-mono text-slate-300">Chủ đề liên hệ</label>
                <input
                  v-model="formData.subject"
                  type="text"
                  placeholder="Cơ hội việc làm / Hợp tác đồ án / Kết nối giao lưu"
                  class="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-mono text-slate-300">Nội dung tin nhắn *</label>
                <textarea
                  v-model="formData.message"
                  required
                  rows="4"
                  placeholder="Chia sẻ ngắn gọn điều bạn muốn trao đổi cùng Đạt..."
                  class="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-semibold text-sm shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Send class="w-4 h-4" />
                <span>{{ isSubmitting ? 'Đang gửi tin nhắn...' : 'Gửi lời nhắn ngay' }}</span>
              </button>
            </form>

          </div>
        </div>

      </div>

      <!-- Footer Note -->
      <div class="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div class="flex items-center gap-1.5">
          <span>&copy; 2026 Nguyễn Anh Đạt. Tự hào sinh ra và lớn lên tại Hà Tĩnh.</span>
        </div>
        <div class="flex items-center gap-1">
          <span>Được xây dựng với Vue 3, TypeScript & Three.js Architecture</span>
        </div>
      </div>

    </div>
  </section>
</template>
