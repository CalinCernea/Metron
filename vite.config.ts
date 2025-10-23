import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  // Adaugă această secțiune pentru a expune variabilele de mediu
  envPrefix: ["VITE_", "SUPABASE_"],
})
