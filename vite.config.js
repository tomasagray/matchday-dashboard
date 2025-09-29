import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
    // Base public path when served in development or production
    base: '/',

    // Server configuration
    server: {
        host: '0.0.0.0', // Allow access from external IPs
        port: 3000,
        open: false,      // Open the browser on server start
        cors: true,
        allowedHosts: [
            'hal9000',
            'localhost',
            '192.168.0.239',
        ],
    },

    // Build configuration
    build: {
        outDir: 'build', // Output directory for build files
        sourcemap: true, // Generate source maps for debugging
    },

    // Plugins
    plugins: [
        react(),
    ],
})
