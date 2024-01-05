import { defineConfig } from "vite";

export default defineConfig({
    base: "/colorista/",
    build: {
        modulePreload: {
            polyfill: false
        },
        rollupOptions: {
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name].[ext]"
            }
        }
    }
})