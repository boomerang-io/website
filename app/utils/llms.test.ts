import type { MenuDoc } from "~/utils/github/docs";
import { absolutizeLinks, buildLlmsTxt } from "./llms";

describe("absolutizeLinks", () => {
  let page = "https://useboomerang.io/docs/flow/main/fundamentals/triggers";

  it("resolves relative links and images against the page", () => {
    expect(
      absolutizeLinks(
        "See [Schedules](../fundamentals/schedules) and ![x](./assets/img/a.png).",
        page
      )
    ).toBe(
      "See [Schedules](https://useboomerang.io/docs/flow/main/fundamentals/schedules) and ![x](https://useboomerang.io/docs/flow/main/fundamentals/assets/img/a.png)."
    );
  });

  it("resolves root links and HTML attributes, and keeps absolute links and anchors", () => {
    expect(
      absolutizeLinks(
        '<a href="/introduction/faq">FAQ</a> [Tekton](https://tekton.dev) [up](#webhook)',
        page
      )
    ).toBe(
      '<a href="https://useboomerang.io/introduction/faq">FAQ</a> [Tekton](https://tekton.dev) [up](#webhook)'
    );
  });
});

describe("buildLlmsTxt", () => {
  let doc = (slug: string, title: string, extra: Partial<MenuDoc> = {}): MenuDoc => ({
    attrs: { title },
    children: [],
    filename: `flow/${slug}.md`,
    hasContent: true,
    slug,
    ...extra,
  });

  it("lists every page by category with its markdown URL", () => {
    let menu = [
      doc("introduction", "Introduction", {
        hasContent: false,
        children: [
          doc("introduction/getting-started", "Getting Started", {
            attrs: { title: "Getting Started", description: "Up and running in no time." },
          }),
        ],
      }),
      doc("hosting", "Self Hosting", { children: [doc("hosting/installing", "Installing")] }),
    ];
    let text = buildLlmsTxt("Boomerang", "Open source for automation.", [
      { title: "Boomerang Flow", baseUrl: "https://useboomerang.io/docs/flow/main", menu },
    ]);

    expect(text).toContain("# Boomerang\n\n> Open source for automation.");
    expect(text).toContain(
      "## Boomerang Flow: Introduction\n\n- [Getting Started](https://useboomerang.io/docs/flow/main/introduction/getting-started.md): Up and running in no time."
    );
    // a category with its own content is listed before its children
    expect(text).toContain(
      "- [Self Hosting](https://useboomerang.io/docs/flow/main/hosting.md)\n- [Installing](https://useboomerang.io/docs/flow/main/hosting/installing.md)"
    );
  });
});
