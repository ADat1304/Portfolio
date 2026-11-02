import os from 'node:os'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const currentUser = os.userInfo().username || process.env.USERNAME || 'local'

// https://vite.dev/config/
export default defineConfig({
  // Windows accounts must not share optimizer caches with different file owners.
  cacheDir: `.vite-cache/user-${currentUser}`,
  plugins: [vue(), tailwindcss()],
})
