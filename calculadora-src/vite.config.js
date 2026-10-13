import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// A calculadora é publicada em https://4watt.tech/calculadora/ — por isso o
// base '/calculadora/' e o output na pasta ../calculadora (commitada no repo
// do site; o deploy é upload manual apenas dessa pasta).
export default defineConfig({
  plugins: [react()],
  base: '/calculadora/',
  build: {
    outDir: '../calculadora',
    emptyOutDir: true
  }
})
