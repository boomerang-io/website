import { getDocRedirect } from "./doc";

describe("getDocRedirect", () => {
  it("sends a moved page to its new path on the release branch", () => {
    expect(getDocRedirect("flow", "main", "guides/edit")).toBe(
      "/docs/flow/main/guides/workflow-editor"
    );
    expect(getDocRedirect("flow", "main", "fundamentals/quotas")).toBe(
      "/docs/flow/main/webapp/quotas"
    );
  });

  it("leaves released versions with their own pages", () => {
    expect(getDocRedirect("flow", "4.0.0", "guides/edit")).toBeUndefined();
  });

  it("ignores pages that did not move", () => {
    expect(getDocRedirect("flow", "main", "fundamentals/tasks")).toBeUndefined();
    expect(getDocRedirect("flow", "main", undefined)).toBeUndefined();
    expect(getDocRedirect("bosun", "main", "guides/edit")).toBeUndefined();
  });
});
