import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    // REMOVED: viteStaticCopy plugin was causing Netlify build to fail
    // because it couldn't find 'src/data' during the build process.
    // The data files will be handled by the build process directly or
    // accessed via relative paths from the 'dist' folder.
  ],
  // Revert base to './' for Netlify (more universal)
  base: './',
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
    outDir: 'dist', // Output to 'dist' folder for Netlify
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  }
})
