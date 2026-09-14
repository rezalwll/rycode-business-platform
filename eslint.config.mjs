import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    ".output/**",
    ".vinxi/**",
    "dist/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "src/generated/**",
    "src/routes/**",
    "src/integrations/**",
    "src/components/workspace/**",
    "src/components/ui/**",
    "src/hooks/**",
    "src/lib/i18n.ts",
    "src/lib/public-content.ts",
    "src/lib/workspace/**",
    "src/routeTree.gen.ts",
    "src/router.tsx",
    "src/server.ts",
    "src/start.ts",
    "vite.config.ts",
    "supabase/**",
  ]),
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);
