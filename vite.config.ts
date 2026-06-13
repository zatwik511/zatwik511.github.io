import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed to GitHub Pages on a user/organization repo (zatwik511.github.io),
// which serves from the domain root, so the base path is '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
