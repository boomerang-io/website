import * as semver from "semver";
import iso_639_1 from "iso-639-1";
import { docConfig, getProduct, type Product } from "~/config/doc";

const CODES: string[] = iso_639_1.getAllCodes();

/**
 * Returns the canonical "<product>/<ref>/<slug>" path for a docs URL, or null when the URL
 * already is one. `product` is what the first segment resolves to (getProduct, else the default
 * product) and `tags`/`branches` are that product's.
 *
 * Earlier URLs are redirected too: a language in the product position (/docs/en/main/...), a
 * product alias (/docs/boomerang-flow/...) and no product at all (/docs/introduction/...).
 */
export function validateParams(
  tags: string[],
  branches: string[],
  params: { product: string; ref?: string; ["*"]?: string },
  product: Product,
): string | null {
  let { product: first, ref, "*": splat } = params;
  let { releaseBranch } = docConfig.products[product];

  let isCanonical = first === product;
  let namesProduct =
    isCanonical || getProduct(first) === product || CODES.includes(first);
  let [second, ...slug] = (namesProduct ? [ref, splat] : [first, ref, splat])
    .filter((segment): segment is string => !!segment);

  if (!second) {
    return [product, releaseBranch].join("/");
  }

  if (tags.includes(second) || branches.includes(second)) {
    return isCanonical ? null : [product, second, ...slug].join("/");
  }

  // Shorthand versions: "4" is the latest 4.x.x, "4.1" the latest 4.1.x.
  let expandedRef = semver.maxSatisfying(tags, second, {
    includePrerelease: false,
  });
  if (expandedRef) {
    return [product, expandedRef, ...slug].join("/");
  }

  // If second looks like a semver tag but we didn't find it as a ref in the repo, we might
  // just have a stale set of tags from GitHub. Instead of generating a 404 we point them to the
  // requested doc on the release branch.
  if (semver.valid(second)) {
    return [product, releaseBranch, ...slug].join("/");
  }

  // No ref at all, so second is the start of the slug. Falling back to the release branch
  // rather than the latest release keeps slug 404 redirects in docs.$product.$ref.$.tsx safe:
  // they only run on the release branch.
  return [product, releaseBranch, second, ...slug].join("/");
}
