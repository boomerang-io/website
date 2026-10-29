/*
 * Liveness/readiness probe: GET /health -> 200 {"status":"UP"}.
 *
 * A resource route that answers from this process alone, so a probe never calls GitHub (the
 * home page loader does).
 */
export function loader() {
  return Response.json({ status: "UP" });
}
