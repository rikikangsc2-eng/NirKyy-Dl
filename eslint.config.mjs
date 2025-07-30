/*
* Lokasi: eslint.config.mjs
* Versi: v1
*/

import nextPlugin from "@next/eslint-plugin-next";

const config = [
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];

export default config;