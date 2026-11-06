import { processMarkdown } from "./md.server";

describe("GitHub-style alerts", () => {
  it("turns a [!NOTE] blockquote into a titled alert", async () => {
    let { html } = await processMarkdown(
      "> [!NOTE]\n> Runs are queued and reliably executed.\n"
    );
    expect(html).toContain('<div class="md-alert md-alert-note">');
    expect(html).toContain('<p class="md-alert-title">Note</p>');
    expect(html).toContain("<p>Runs are queued and reliably executed.</p>");
    expect(html).not.toContain("[!NOTE]");
  });

  it("handles every alert type and leaves plain blockquotes alone", async () => {
    let { html } = await processMarkdown(
      "> [!TIP]\n> One.\n\n> [!WARNING]\n> Two.\n\n> **Note:** three.\n"
    );
    expect(html).toContain("md-alert-tip");
    expect(html).toContain("md-alert-warning");
    expect(html).toContain("<blockquote>");
  });
});

describe("tabs", () => {
  let markdown = [
    "<!-- tabs -->",
    "",
    "### Helm",
    "",
    "Install the chart.",
    "",
    "### Manifests",
    "",
    "Apply the manifests.",
    "",
    "<!-- /tabs -->",
  ].join("\n");

  it("makes a tab per heading with the first panel showing", async () => {
    let { html } = await processMarkdown(markdown);
    expect(html).toContain('<div class="md-tabs" data-md-tabs="">');
    expect(html).toMatch(/<button type="button" role="tab"[^>]*aria-selected="true"[^>]*>Helm<\/button>/);
    expect(html).toMatch(/<button type="button" role="tab"[^>]*aria-selected="false"[^>]*>Manifests<\/button>/);
    expect(html).toMatch(/role="tabpanel"[^>]*data-panel="1" hidden>/);
    expect(html).not.toContain("<h3");
  });

  it("leaves an unclosed marker as plain content", async () => {
    let { html } = await processMarkdown("<!-- tabs -->\n\n### Helm\n\nText.\n");
    expect(html).toContain("<h3");
    expect(html).not.toContain("md-tabs");
  });
});
