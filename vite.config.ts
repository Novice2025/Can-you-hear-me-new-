import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        { src: 'src/data', dest: 'data' }
      ]
    })
  ],
  // THIS IS THE CRITICAL CHANGE FOR GITHUB PAGES
  base: '/Can-you-hear-me-new-/', // <--- CHANGE THIS LINE to your repository name
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/_variables.scss";`
      }
    }
  },
  build: {
    outDir: 'docs' // Output to 'docs' folder for GitHub Pages
  }
})
