import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

/**
 * Dev-only auth: resolve the current Lemma access token from the CLI and seed
 * localStorage before the app bundle runs. Never runs during `vite build`, so
 * no token ships in production bundles.
 */
function lemmaDevAuth(env) {
  const command = env.VITE_LEMMA_DEV_TOKEN_CMD ?? 'lemma auth print-token'
  return {
    name: 'lemma-dev-auth',
    apply: 'serve',
    transformIndexHtml() {
      if (!command.trim()) return
      let token = ''
      try {
        token = execSync(command, {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim()
      } catch {
        return
      }
      if (!token) return
      return [
        {
          tag: 'script',
          injectTo: 'head-prepend',
          children: `try{localStorage.setItem("lemma_token",${JSON.stringify(token)})}catch(e){}`,
        },
      ]
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), lemmaDevAuth(env)],
    resolve: {
      dedupe: ['react', 'react-dom', '@tanstack/react-query'],
    },
    server: {
      proxy: {
        '/lemma-api': {
          target: 'https://api.lemma.work',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/lemma-api/, ''),
          secure: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-hot-toast'],
            'ui-vendor': ['framer-motion', 'lucide-react', 'recharts'],
            'pdf-vendor': ['pdfjs-dist'],
            'doc-vendor': ['mammoth'],
            'lemma-vendor': ['lemma-sdk', '@tanstack/react-query'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  }
})
