import path from "path";
import { createTarballStream } from "./repo-tarball";
import { createTarFileProcessor, markdownPattern } from "./tarball.server";
import { getFixtureStream } from "./docs.test";

describe("createTarFileProcessor", () => {
  it("extracts and processes the markdown files of one folder", async () => {
    let processFiles = createTarFileProcessor(
      getFixtureStream(),
      markdownPattern("docs"),
    );
    let docs: string[] = [];
    await processFiles(async ({ filename, content }) => {
      expect(content).toMatch(/^---\ntitle: /);
      docs.push(filename);
    });

    expect(docs.sort()).toMatchInlineSnapshot(`
      [
        "docs/components/index.md",
        "docs/components/link.md",
        "docs/components/router.md",
        "docs/index.md",
        "docs/pages/index.md",
        "docs/pages/overview.md",
        "docs/pages/tutorial.md",
      ]
    `);
  });

  it("reads a local checkout the same way", async () => {
    let stream = createTarballStream(path.join(__dirname, "__test__"), "bosun");
    let processFiles = createTarFileProcessor(stream, markdownPattern("bosun"));
    let docs: string[] = [];
    await processFiles(async ({ filename }) => {
      docs.push(filename);
    });

    expect(docs.sort()).toEqual([
      "bosun/index.md",
      "bosun/introduction/index.md",
      "bosun/introduction/overview.md",
    ]);
  });
});
