import { envSchema } from "./env.server";

describe("envSchema", () => {
  let parse = (NO_CACHE?: string) =>
    envSchema.parse({ SOURCE_REPO: "boomerang-io/docs", NO_CACHE }).NO_CACHE;

  it("keeps caching on unless NO_CACHE says otherwise", () => {
    expect(parse()).toBe(false);
    expect(parse("false")).toBe(false);
    expect(parse("0")).toBe(false);
  });

  it("turns caching off", () => {
    expect(parse("true")).toBe(true);
    expect(parse("1")).toBe(true);
  });

  it("refuses a value it cannot read", () => {
    expect(() => parse("maybe")).toThrow();
  });
});
