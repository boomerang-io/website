import type { MenuDoc } from "~/utils/github/docs";

/**
 * Rewrites the relative links and images in a page's markdown to absolute URLs, resolved the way
 * a browser resolves them on the rendered page, so the markdown stands on its own.
 */
export function absolutizeLinks(markdown: string, pageUrl: string): string {
  let resolve = (target: string) => {
    if (/^([a-z][a-z0-9+.-]*:|#)/i.test(target)) return target;
    try {
      return new URL(target, pageUrl).href;
    } catch {
      return target;
    }
  };
  return markdown
    .replace(/(\]\()([^)\s]+)/g, (_, open: string, target: string) => open + resolve(target))
    .replace(/((?:href|src)=")([^"]+)/g, (_, open: string, target: string) => open + resolve(target));
}

export type LlmsSection = {
  title: string;
  // The product's docs root on the release branch, i.e. https://useboomerang.io/docs/flow/main
  baseUrl: string;
  menu: MenuDoc[];
};

/**
 * /llms.txt (https://llmstxt.org): one line per page, linking its markdown, grouped by product
 * and menu category in the sidebar's order.
 */
export function buildLlmsTxt(
  name: string,
  summary: string,
  sections: LlmsSection[]
): string {
  let line = (baseUrl: string, doc: MenuDoc) => {
    let description =
      typeof doc.attrs.description === "string" ? `: ${doc.attrs.description}` : "";
    return `- [${doc.attrs.title}](${baseUrl}/${doc.slug}.md)${description}`;
  };

  let lines = [
    `# ${name}`,
    "",
    `> ${summary}`,
    "",
    "Every page below is Markdown; drop the `.md` for the rendered page.",
  ];
  for (let { title, baseUrl, menu } of sections) {
    for (let category of menu) {
      let docs = [
        ...(category.hasContent ? [category] : []),
        ...category.children,
      ];
      if (docs.length === 0) continue;
      lines.push("", `## ${title}: ${category.attrs.title}`, "");
      lines.push(...docs.map((doc) => line(baseUrl, doc)));
    }
  }
  return lines.join("\n") + "\n";
}
