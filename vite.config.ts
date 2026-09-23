import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

const apkServePlugin = (): Plugin => ({
  name: 'apk-serve-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && (req.url.endsWith('.apk') || req.url.includes('.apk?'))) {
        const cleanUrl = req.url.split('?')[0];
        const filePath = path.join(__dirname, 'public', cleanUrl);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          res.writeHead(200, {
            'Content-Type': 'application/vnd.android.package-archive',
            'Content-Length': stats.size,
            'Content-Disposition': 'attachment; filename="kalenderku-v2.0-release.apk"',
            'Cache-Control': 'no-cache',
          });
          return fs.createReadStream(filePath).pipe(res);
        }
      }
      next();
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apkServePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
