import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed to GitHub Pages on a user/organization repo (zatwik511.github.io),
// which serves from the domain root, so the base path is '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  // Treat downloadable binaries dropped in pages/ as static assets (so they get
  // a bundled URL) rather than letting Vite try to parse them as JS.
  assetsInclude: [
    '**/*.exe',
    '**/*.msi',
    '**/*.dmg',
    '**/*.appimage',
    '**/*.deb',
    '**/*.apk',
    '**/*.pdf',
  ],
})
