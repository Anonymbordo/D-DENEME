import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://openrouter.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, '/api/v1/chat/completions'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Authorization', 'Bearer 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')
            proxyReq.setHeader('HTTP-Referer', 'http://localhost:5173')
            proxyReq.setHeader('X-Title', 'HEALFLOW Diet Assistant')
          })
        }
      }
    }
  }
})
