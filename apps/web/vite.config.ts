/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@shared-ui': path.resolve(__dirname, './src/shared-ui'),
      '@campusstay/constants': path.resolve(__dirname, '../../packages/constants/src'),
      '@campusstay/permissions': path.resolve(__dirname, '../../packages/permissions/src'),
      '@campusstay/types': path.resolve(__dirname, '../../packages/types/src'),
      '@campusstay/validators': path.resolve(__dirname, '../../packages/validators/src'),
      '@campusstay/api-client': path.resolve(__dirname, '../../packages/api-client/src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      '../../packages/**/*.{test,spec}.{ts,tsx}',
    ],
  },
});
