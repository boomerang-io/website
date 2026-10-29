import { filterReleases, getLatestVersion, getLatestVersionHeads } from "./tags";

describe("getLatestVersionHeads", () => {
  it("gets the latest version heads", () => {
    let tags = [
      "1.0.0",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "2.0.0",
      "2.0.1",
      "2.1.0",
      "2.1.1",
      "3.0.0",
      "3.1.0",
      "3.2.0",
    ];
    let heads = getLatestVersionHeads(tags);
    expect(heads).toEqual(["3.2.0", "2.1.1", "1.1.2"]);
  });

  it("doesn't depend on order", () => {
    let tags = [
      "3.2.0",
      "1.0.0",
      "1.1.0",
      "2.1.0",
      "1.1.2",
      "1.1.1",
      "2.0.0",
      "2.0.1",
      "2.1.1",
      "3.0.0",
      "3.1.0",
    ];
    let heads = getLatestVersionHeads(tags);
    expect(heads).toEqual(["3.2.0", "2.1.1", "1.1.2"]);
  });

  it("includes each minor with includeMinor", () => {
    let heads = getLatestVersionHeads(["1.0.0", "1.1.0", "1.1.1", "2.0.0"], true);
    expect(heads).toEqual(["2.0.0", "1.1.1", "1.0.0"]);
  });
});

describe("filterReleases", () => {
  let tagNames = [
    "flow@4.0.0",
    "bosun@1.0.0",
    "flow@4.1.0-beta.1",
    "flow@3.12.0",
    "v5.0.0",
    "flow@next",
  ];

  it("keeps one product's versions, without the prefix", () => {
    expect(filterReleases(tagNames, "flow@")).toEqual([
      "4.0.0",
      "4.1.0-beta.1",
      "3.12.0",
    ]);
    expect(filterReleases(tagNames, "bosun@")).toEqual(["1.0.0"]);
  });

  it("finds the latest stable version", () => {
    expect(getLatestVersion(filterReleases(tagNames, "flow@"))).toBe("4.0.0");
    expect(getLatestVersion([])).toBeUndefined();
  });
});
