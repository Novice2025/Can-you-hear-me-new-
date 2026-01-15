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
      // Revert base to './' for Netlify (more universal)
      base: './', // <--- CHANGED THIS LINE BACK
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
        outDir: 'dist', // <--- CHANGED THIS BACK TO 'dist' for Netlify
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
