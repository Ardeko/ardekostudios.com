import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite'ın SPA fallback'i `/decoy/` isteğini kök `index.html`'e (React
 * uygulamasına) düşürüyor. Oyun `public/decoy/index.html` altında; dizin
 * isteğini o dosyaya yönlendir ki karttaki `/decoy/` hem dev'de hem
 * `vite preview`'da gerçek oyunu açsın.
 */
function decoyDirectoryIndex() {
  const rewrite = (req, _res, next) => {
    const [path, query] = (req.url || '').split('?')
    if (path === '/decoy' || path === '/decoy/') {
      req.url = '/decoy/index.html' + (query ? '?' + query : '')
    }
    next()
  }
  return {
    name: 'decoy-directory-index',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), decoyDirectoryIndex()],
})
