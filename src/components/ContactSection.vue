<script setup lang="ts">
import { ref } from 'vue';
import { 
  Mail, Phone, MapPin, Send, Check, Copy, 
  Github, Linkedin, Download, Sparkles 
} from 'lucide-vue-next';
import { sound } from '../utils/sound';
import SlantedBanner from './SlantedBanner.vue';

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
  <section id="contact" class="py-24 relative bg-portfolio-section overflow-hidden">
    <!-- Ambient glow -->

    <div class="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 pb-6 border-b border-white/5">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-portfolio-glow/10 border border-portfolio-glow/20 text-portfolio-accent text-xs font-mono">
            <Mail class="w-3.5 h-3.5" />
            <span>Sẵn sàng kết nối & hợp tác</span>
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Liên Hệ & <span class="text-portfolio-accent">Kết Nối</span>
          </h2>
        </div>
        <SlantedBanner copy="Let's Connect" variant="red" rotation="-3deg" size="sm" />
      </div>

      <!-- Content Grid: Left Contact Info (5 cols) | Right Interactive Form (7 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left Contact Cards -->
        <div class="lg:col-span-5 space-y-6 text-left">
          
          <div class="p-8 rounded-3xl bg-[#111113] border border-white/10 space-y-6 shadow-2xl">
            <div class="space-y-1">
              <span class="text-xs font-mono text-portfolio-accent uppercase tracking-widest font-semibold">Thông tin trực tiếp</span>
              <h3 class="text-2xl font-bold text-white">Nguyễn Anh Đạt</h3>
              <p class="text-xs text-portfolio-muted">Sinh viên Khoa học Máy tính &bull; Kỹ sư phần mềm tương lai</p>
            </div>

            <div class="space-y-4 pt-2">
              <!-- Location -->
              <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div class="w-10 h-10 rounded-xl bg-portfolio-glow/10 border border-portfolio-glow/20 flex items-center justify-center text-portfolio-accent shrink-0">
                  <MapPin class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-[11px] font-mono text-portfolio-subtle">Quê quán / Hiện tại:</div>
                  <div class="text-sm font-semibold text-slate-200">Hà Tĩnh / Hà Nội, Việt Nam</div>
                </div>
              </div>

              <!-- Email with copy -->
              <div class="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div class="flex items-center gap-3.5 overflow-hidden">
                  <div class="w-10 h-10 rounded-xl bg-portfolio-glow/10 border border-portfolio-glow/20 flex items-center justify-center text-portfolio-accent shrink-0">
                    <Mail class="w-4 h-4" />
                  </div>
                  <div class="truncate">
                    <div class="text-[11px] font-mono text-portfolio-subtle">Email:</div>
                    <div class="text-xs sm:text-sm font-semibold text-slate-200 truncate">anhdat.nguyen.dev@gmail.com</div>
                  </div>
                </div>

                <button
                  @click="copyEmail"
                  :title="copied ? 'Đã sao chép' : 'Sao chép email'"
                  class="px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ml-2"
                  :class="copied ? 'bg-portfolio-glow/20 text-portfolio-accent border border-portfolio-glow/30' : 'bg-white/5 hover:bg-white/10 text-portfolio-muted border border-white/10'"
                >
                  <Check v-if="copied" class="w-3.5 h-3.5 text-portfolio-accent" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copied ? 'Đã copy' : 'Copy' }}</span>
                </button>
              </div>

              <!-- Phone -->
              <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div class="w-10 h-10 rounded-xl bg-portfolio-glow/10 border border-portfolio-glow/20 flex items-center justify-center text-portfolio-accent shrink-0">
                  <Phone class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-[11px] font-mono text-portfolio-subtle">Số điện thoại:</div>
                  <div class="text-sm font-semibold text-slate-200">(+84) 987 654 321</div>
                </div>
              </div>
            </div>

            <!-- Social Links & Resume Download -->
            <div class="pt-4 border-t border-white/5 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-portfolio-muted hover:text-white text-xs border border-white/10 transition-all"
              >
                <Github class="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-portfolio-muted hover:text-white text-xs border border-white/10 transition-all"
              >
                <Linkedin class="w-4 h-4 text-portfolio-accent" />
                <span>LinkedIn</span>
              </a>
              <button
                @click="handleDownloadCV"
                class="flex items-center gap-2 px-4 py-2 rounded-full bg-portfolio-action text-white font-semibold text-xs shadow-md shadow-portfolio-glow/20 hover:opacity-95 transition-all cursor-pointer ml-auto"
              >
                <Download class="w-3.5 h-3.5" />
                <span>Tải CV (PDF)</span>
              </button>
            </div>

          </div>

          <!-- 3D Model Contact Anchor hint -->
          <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-portfolio-muted">
            <Sparkles class="w-4 h-4 text-portfolio-accent shrink-0" />
            <span>Màn 5 kết nối với model 3D: <code>avatar-contact.glb</code> (Tư thế chào tạm biệt & kết nối).</span>
          </div>

        </div>

        <!-- Right Message Form -->
        <div class="lg:col-span-7">
          <div class="p-8 rounded-3xl bg-[#111113] border border-white/10 shadow-2xl text-left relative">
            
            <div v-if="formSubmitted" class="py-12 text-center space-y-4">
              <div class="w-16 h-16 rounded-full bg-portfolio-glow/20 border border-portfolio-glow/30 flex items-center justify-center text-portfolio-accent mx-auto">
                <Check class="w-8 h-8" />
              </div>
              <h4 class="text-2xl font-bold text-white">Cảm ơn bạn đã gửi lời nhắn!</h4>
              <p class="text-sm text-portfolio-muted max-w-md mx-auto">
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
                <p class="text-xs text-portfolio-muted">Tôi luôn kiểm tra email và phản hồi trong vòng 24 giờ.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-mono text-portfolio-muted">Họ và tên *</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    class="w-full px-4 py-2.5 rounded-full bg-portfolio-raised border border-white/10 focus:border-portfolio-glow focus:outline-none text-sm text-white placeholder:text-portfolio-subtle transition-colors"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-mono text-portfolio-muted">Địa chỉ Email *</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    placeholder="email@domain.com"
                    class="w-full px-4 py-2.5 rounded-full bg-portfolio-raised border border-white/10 focus:border-portfolio-glow focus:outline-none text-sm text-white placeholder:text-portfolio-subtle transition-colors"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-mono text-portfolio-muted">Chủ đề liên hệ</label>
                <input
                  v-model="formData.subject"
                  type="text"
                  placeholder="Cơ hội việc làm / Hợp tác đồ án / Kết nối giao lưu"
                  class="w-full px-4 py-2.5 rounded-full bg-portfolio-raised border border-white/10 focus:border-portfolio-glow focus:outline-none text-sm text-white placeholder:text-portfolio-subtle transition-colors"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-mono text-portfolio-muted">Nội dung tin nhắn *</label>
                <textarea
                  v-model="formData.message"
                  required
                  rows="4"
                  placeholder="Chia sẻ ngắn gọn điều bạn muốn trao đổi cùng Đạt..."
                  class="w-full px-4 py-2.5 rounded-3xl bg-portfolio-raised border border-white/10 focus:border-portfolio-glow focus:outline-none text-sm text-white placeholder:text-portfolio-subtle transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full py-3 rounded-full bg-portfolio-action hover:opacity-95 text-white font-semibold text-sm shadow-xl shadow-portfolio-glow/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Send class="w-4 h-4" />
                <span>{{ isSubmitting ? 'Đang gửi tin nhắn...' : 'Gửi lời nhắn ngay' }}</span>
              </button>
            </form>

          </div>
        </div>

      </div>

      <!-- Footer Note -->
      <div class="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-portfolio-subtle">
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
