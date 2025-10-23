import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode } ) => {
  const env = loadEnv(mode, process.cwd(), 
  // Load all env vars (not just those prefixed with VITE_)
  '') 

  return {
    plugins: [react()],
    define: {
      // Expose env vars to your client code
      // Make sure to stringify them, otherwise Vite will replace them with their raw values
      // which can be problematic for security and type safety
      'process.env': JSON.stringify(env),
    },
  }
})
