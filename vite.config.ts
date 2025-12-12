import path from "path"
import { defineConfig, type UserConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import type { InlineConfig } from "vitest/node"
import { VitePWA } from "vite-plugin-pwa"
// https://vite.dev/config/

type ViteConfig = UserConfig & { test: InlineConfig }

const config: ViteConfig = {
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: {
                enabled: true,
            },
            includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png"],
            manifest: {
                name: "B-Shop",
                short_name: "BShop",
                description: "",
                theme_color: "#895af6",
                icons: [
                    {
                        src: "pwa-64x64.png",
                        sizes: "64x64",
                        type: "image/png",
                    },
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "maskable-icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
        }),
    ],
    test: {
        environment: "jsdom",
        setupFiles: ["./src/tests/setup.ts"],
        globals: true,
        watch: false,
        include: ["./src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        exclude: ["./src/tests/e2e"],
    },
    resolve: {
        extensions: [".js", ".mjs", ".json", ".ts", ".tsx"],
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
                secure: false,
            },
        },
    },
}

export default defineConfig(config)
