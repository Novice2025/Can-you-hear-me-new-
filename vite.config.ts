import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy' // <--- NEW IMPORT

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({ // <--- NEW PLUGIN CONFIGURATION
      targets: [
        // Copies 'src/data' to 'dist/data'
        // Since you moved your files to public/data, this plugin is actually not strictly needed anymore for the JSON files
        // but it's good to keep if you have other static assets in src/data that you want copied.
        // For now, we'll keep it to ensure any other potential data files are handled.
        { src: 'src/data', dest: 'data' } // This line is now set up to copy src/data to dist/data
      ]
    })
  ],
  base: './', // Ensures correct relative paths for assets
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
  }
})
