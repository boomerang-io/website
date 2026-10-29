import type { RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// The Remix v2 flat-file conventions under app/routes/ (docs.$product.$ref.$.tsx and friends).
export default flatRoutes() satisfies RouteConfig;
