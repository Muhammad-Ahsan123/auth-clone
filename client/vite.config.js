import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // define: {
  //   'process.env': process.env  // This will make process.env available
  // },
  define: {
    'import.meta.env.MODE': JSON.stringify(process.env.VITE_SERVER_DOMAIN),  // Example of replacing a value
  },
  plugins: [react()],
})
