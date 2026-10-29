import { validateParams as validate } from "./params";

let LATEST_V1_MAJOR_TAG: string;
let LATEST_V1_MINOR_TAG: string;

const TAGS = [
  "1.0.0",
  "1.1.0",
  (LATEST_V1_MINOR_TAG = "1.1.1"),
  (LATEST_V1_MAJOR_TAG = "1.2.0"),
  "2.0.0",
  "2.1.0",
  "3.0.0-pre.0",
];

const BRANCHES = ["main", "dev"];

describe("validateParams", () => {
  describe("with the product in the first position", () => {
    describe("and a valid tag in the second position", () => {
      it("returns null", () => {
        expect(
          validate(TAGS, BRANCHES, { product: "flow", ref: "1.0.0" }, "flow"),
        ).toBe(null);
        expect(
          validate(
            TAGS,
            BRANCHES,
            { product: "flow", ref: "1.0.0", "*": "beef" },
            "flow",
          ),
        ).toBe(null);
      });
    });

    describe("and a valid shorthand tag", () => {
      it("expands the major shorthand", () => {
        expect(
          validate(TAGS, BRANCHES, { product: "flow", ref: "1" }, "flow"),
        ).toBe(`flow/${LATEST_V1_MAJOR_TAG}`);
      });
      it("expands the minor shorthand", () => {
        expect(
          validate(TAGS, BRANCHES, { product: "flow", ref: "1.1" }, "flow"),
        ).toBe(`flow/${LATEST_V1_MINOR_TAG}`);
      });
      it("expands the major shorthand, preserves splat", () => {
        expect(
          validate(
            TAGS,
            BRANCHES,
            { product: "flow", ref: "1", "*": "beef/taco" },
            "flow",
          ),
        ).toBe(`flow/${LATEST_V1_MAJOR_TAG}/beef/taco`);
      });
    });

    describe("and a valid branch in the second position", () => {
      it("returns null", () => {
        expect(
          validate(TAGS, BRANCHES, { product: "flow", ref: "dev" }, "flow"),
        ).toBe(null);
        expect(
          validate(
            TAGS,
            BRANCHES,
            { product: "flow", ref: "main", "*": "beef" },
            "flow",
          ),
        ).toBe(null);
      });
    });

    it("redirects to the release branch", () => {
      expect(validate(TAGS, BRANCHES, { product: "flow" }, "flow")).toBe(
        "flow/main",
      );
    });

    describe("and an invalid branch or tag in the second position", () => {
      it("treats it as the slug on the release branch", () => {
        expect(
          validate(TAGS, BRANCHES, { product: "flow", ref: "beef" }, "flow"),
        ).toBe("flow/main/beef");
      });
      it("drops a version that was never released", () => {
        expect(
          validate(
            TAGS,
            BRANCHES,
            { product: "flow", ref: "9.9.9", "*": "beef" },
            "flow",
          ),
        ).toBe("flow/main/beef");
      });
    });
  });

  describe("with an earlier URL", () => {
    it("replaces a product alias", () => {
      expect(
        validate(
          TAGS,
          BRANCHES,
          { product: "boomerang-flow", ref: "introduction", "*": "overview" },
          "flow",
        ),
      ).toBe("flow/main/introduction/overview");
    });

    it("replaces a language with the product", () => {
      expect(
        validate(
          TAGS,
          BRANCHES,
          { product: "en", ref: "main", "*": "beef" },
          "flow",
        ),
      ).toBe("flow/main/beef");
      expect(
        validate(TAGS, BRANCHES, { product: "en", ref: "1.0.0" }, "flow"),
      ).toBe("flow/1.0.0");
    });
  });

  describe("without a product in the first position", () => {
    it("adds the product to a tag", () => {
      expect(validate(TAGS, BRANCHES, { product: "1.0.0" }, "flow")).toBe(
        "flow/1.0.0",
      );
    });

    it("adds the product and keeps splat params around", () => {
      expect(
        validate(TAGS, BRANCHES, { product: "1.0.0", ref: "beef" }, "flow"),
      ).toBe("flow/1.0.0/beef");
    });

    it("adds the product, expands the major tag", () => {
      expect(validate(TAGS, BRANCHES, { product: "1" }, "flow")).toBe(
        `flow/${LATEST_V1_MAJOR_TAG}`,
      );
    });

    it("adds the product to a branch", () => {
      expect(validate(TAGS, BRANCHES, { product: "main" }, "flow")).toBe(
        "flow/main",
      );
    });

    it("adds the product and release branch to a slug", () => {
      expect(
        validate(
          TAGS,
          BRANCHES,
          { product: "introduction", ref: "getting-started" },
          "flow",
        ),
      ).toBe("flow/main/introduction/getting-started");
    });
  });

  describe("with a product that has no releases", () => {
    it("accepts its branches", () => {
      expect(
        validate([], BRANCHES, { product: "bosun", ref: "main" }, "bosun"),
      ).toBe(null);
    });

    it("sends a version to the release branch", () => {
      expect(
        validate(
          [],
          BRANCHES,
          { product: "bosun", ref: "1.0.0", "*": "introduction" },
          "bosun",
        ),
      ).toBe("bosun/main/introduction");
    });
  });
});
