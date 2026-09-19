import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  globalIgnores([
    // Next.js
    ".next/**",

    // Production output
    "out/**",

    // Dependencies
    "node_modules/**",

    // Generated files
    "next-env.d.ts",

    // Local uploads/media
    "public/uploads/**",

    // Environment files
    ".env",
    ".env.*",
  ]),
]);