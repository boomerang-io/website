/// <reference types="vitest/config" />
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  // The build bundles every dependency into build/server, so the runtime image carries only the
  // serving packages in package.json `dependencies` (see the Dockerfile). The dev server loads
  // dependencies through Node as usual.
  ssr: {
    noExternal: command === "build" ? true : undefined,
  },
  // vitest runs the utils directly, not through the router.
  plugins: [!process.env.VITEST && reactRouter()],
  test: {
    globals: true,
    environment: "node",
    include: ["app/**/*.test.ts"],
    // app/utils/env.server.ts validates at import time.
    env: {
      SOURCE_REPO: "boomerang-io/docs",
    },
  },
}));
