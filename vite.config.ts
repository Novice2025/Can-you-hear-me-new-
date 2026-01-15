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
  // CRITICAL CHANGE: Ensure base is absolute for GitHub Pages
  base: '/Can-you-hear-me-new-/', // <--- THIS MUST BE YOUR REPO NAME
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
    outDir: 'docs', // Output to 'docs' folder for GitHub Pages
    assetsDir: 'assets', // Ensure assets are in 'docs/assets'
    rollupOptions: {
      output: {
        // Ensure all chunks and assets are loaded with the correct base path
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  }
})
