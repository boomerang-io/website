/*
This file configures the products whose documentation is served from the SOURCE_REPO repository.
Each product is a top-level folder of that repository with its own release line, served at
/docs/<product>/<ref>/<slug>.

- defaultProduct: the product a URL without one resolves to, i.e. /docs/introduction/overview.
- title: shown in the product switcher and in page titles.
- pathToDocs: the folder in the repository, i.e. "flow".
- aliases: earlier URL names that redirect to the product, i.e. "boomerang-flow" from the previous site.
- branches: the branches added to the version switcher. If running locally, "local" is added by the code.
- releaseBranch: the branch used as the release branch. A URL without a version resolves to it.
- versions.prefix: the release tag prefix, i.e. "flow@" for "flow@4.0.0". URLs carry the version without it.
- versions.includeMinor: If true, the minor version will be included in the version list i.e. "1.1.0" and "1.2.0". If false, only the latest major version will be included i.e. "1.2.0".
- redirects: moved pages, old slug → new slug. Applied only when the old slug 404s on the release branch, so
  released versions keep their own pages.
*/

export type ProductConfig = {
  title: string;
  pathToDocs: string;
  aliases: string[];
  branches: string[];
  releaseBranch: string;
  versions: {
    prefix: string;
    includeMinor: boolean;
  };
  redirects?: Record<string, string>;
};

const products = {
  flow: {
    title: "Boomerang Flow",
    pathToDocs: "flow",
    aliases: ["boomerang-flow"],
    branches: ["main"],
    releaseBranch: "main",
    versions: {
      prefix: "flow@",
      includeMinor: true,
    },
    // The Flow v5 restructure (boomerang-io/docs feat-flow-v5).
    redirects: {
      "guides/edit": "guides/workflow-editor",
      "guides/delete": "guides/create",
      "guides/management": "guides/create",
      "guides/params": "fundamentals/parameters",
      "architecture/agents": "architecture/dispatchers",
      "architecture/tasks": "extend/task-contract",
      "hosting/logging": "hosting/task-logs",
      "fundamentals/home": "webapp/home",
      "fundamentals/activity": "webapp/activity",
      "fundamentals/insights": "webapp/insights",
      "fundamentals/schedules": "webapp/schedules",
      "fundamentals/integrations": "webapp/integrations",
      "fundamentals/manage": "webapp/manage",
      "fundamentals/quotas": "webapp/quotas",
      "fundamentals/administer": "webapp/administer",
    },
  },
  bosun: {
    title: "Boomerang Bosun",
    pathToDocs: "bosun",
    aliases: ["boomerang-bosun"],
    branches: ["main"],
    releaseBranch: "main",
    versions: {
      prefix: "bosun@",
      includeMinor: true,
    },
  },
} satisfies Record<string, ProductConfig>;

export type Product = keyof typeof products;

export const docConfig: {
  defaultProduct: Product;
  products: Record<Product, ProductConfig>;
} = {
  defaultProduct: "flow",
  products,
};

export type DocConfig = typeof docConfig;

/**
 * The product a URL segment names, by key or alias.
 */
export function getProduct(segment: string | undefined): Product | undefined {
  if (!segment) return undefined;
  return (Object.keys(docConfig.products) as Product[]).find(
    (product) =>
      product === segment ||
      docConfig.products[product].aliases.includes(segment),
  );
}

/**
 * Where a moved page now lives, as a docs path, or undefined. Only the release branch redirects.
 */
export function getDocRedirect(
  product: Product,
  ref: string,
  slug: string | undefined,
): string | undefined {
  let { releaseBranch, redirects } = docConfig.products[product];
  let target = ref === releaseBranch && slug ? redirects?.[slug] : undefined;
  return target && `/docs/${product}/${ref}/${target}`;
}

/**
 * The git ref behind a URL ref: release versions get the product's tag prefix back
 * ("4.0.0" → "flow@4.0.0"); branches and "local" are used as they are.
 */
export function getGitHubRef(product: Product, ref: string): string {
  let { branches, versions } = docConfig.products[product];
  if (ref === "local" || branches.includes(ref)) return ref;
  return versions.prefix + ref;
}
