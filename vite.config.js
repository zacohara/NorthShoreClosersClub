import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'build-id',
      transformIndexHtml(html) {
        return html.replace('__BUILD__', Date.now().toString(36));
      }
    }
  ],
})
