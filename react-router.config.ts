import type { Config } from "@react-router/dev/config";

// Framework mode with server rendering: loaders fetch the docs from GitHub on the Node side
// and the browser hydrates the result (app/root.tsx).
export default {
  ssr: true,
  // React Router 8's behaviour, opted into now so the upgrade is a version bump.
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
} satisfies Config;
