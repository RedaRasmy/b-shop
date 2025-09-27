import path from "path"
import { defineConfig, type UserConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import type { InlineConfig } from "vitest/node"

// https://vite.dev/config/

type ViteConfig = UserConfig & { test: InlineConfig }

const config: ViteConfig = {
    plugins: [react(), tailwindcss()],
    test: {
        environment : "jsdom",
        setupFiles: ['./src/tests/setup.ts'],
        globals : true,
        watch : false,
        include : ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    },
    resolve : {
        extensions : ['.js','.mjs','.json','.ts','.tsx'],
        alias : {
            "@" : path.resolve(__dirname,"./src")
        }
    },
    server : {
        proxy : {
            '/api' : {
                target : "http://localhost:3000",
                changeOrigin : true,
                secure : false
            }
        }
    }
}

export default defineConfig(config)
 