import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Add this server configuration
    proxy: {  // Configure proxy
      '/api': {  // Proxy requests starting with /api
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true, //  Required for some scenarios
      },
    },
  },
})