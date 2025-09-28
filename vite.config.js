import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // hoặc để 5173 tùy bạn
    open: true, // 👈 dòng này giúp auto mở browser
    fs: {
      strict: false,
    },
    // 👇 thêm fallback
      proxy: {
    '/api': {
      target: 'http://192.168.1.107:9000', // API backend
      changeOrigin: true,
    },
  },
    historyApiFallback: true,
    host: true, 
  }
});
