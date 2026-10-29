import path from "path";
import { Readable } from "stream";
import * as tar from "tar";
import { getMenuFromStream } from "./docs";

describe("getMenuFromStream", () => {
  it("sorts the menu with children and stuff", async () => {
    let menu = await getMenuFromStream(getFixtureStream(), "docs");

    // removes `index.md` so only 2, not 3
    expect(menu.length).toBe(2);
    expect(menu[0].attrs.title).toBe("Components");
    expect(menu[0].children.length).toBe(2);

    expect(menu[1].attrs.title).toBe("Pages");
    expect(menu[1].children.length).toBe(2);
    expect(menu[1].slug).toBe("pages");
    expect(menu[1].children[0].attrs.title).toBe("Quickstart Tutorial");
    expect(menu[1].children[0].slug).toBe("pages/tutorial");
  });

  it("builds each product's menu from its own folder", async () => {
    let menu = await getMenuFromStream(getFixtureStream(), "bosun");

    expect(menu.map((doc) => doc.slug)).toEqual(["introduction"]);
    expect(menu[0].children.map((doc) => doc.slug)).toEqual([
      "introduction/overview",
    ]);
  });
});

/**
 * Both fixture products in one archive with GitHub's "<repo>-<ref>/" root folder.
 */
export function getFixtureStream(): NodeJS.ReadableStream {
  let cwd = path.join(__dirname, "__test__");
  return Readable.from(
    tar.create({ gzip: true, cwd, prefix: "docs-main" }, ["docs", "bosun"]),
  );
}
