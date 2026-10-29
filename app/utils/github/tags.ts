import { LRUCache } from "lru-cache";
import semver from "semver";
import type { Octokit } from "octokit";
import { env } from "~/utils/env.server";

type CacheContext = { octokit: Octokit };
declare global {
  var releasesCache: LRUCache<string, string[], CacheContext>;
}

/**
 * Fetches the versions released under a tag prefix, without the prefix: the "flow@4.0.0"
 * release is "4.0.0".
 */
export async function getTags(
  repo: string,
  { octokit, releasePrefix }: CacheContext & { releasePrefix: string },
) {
  let tagNames = await releasesCache.fetch(repo, { context: { octokit } });
  return tagNames && filterReleases(tagNames, releasePrefix);
}

export function filterReleases(tagNames: string[], releasePrefix: string) {
  return tagNames
    .filter((tag) => tag.startsWith(releasePrefix))
    .map((tag) => tag.slice(releasePrefix.length))
    .filter((version) => semver.valid(version));
}

export function getLatestVersion(tags: string[]) {
  return semver.maxSatisfying(tags, "*", { includePrerelease: false }) ?? undefined;
}

/**
 * Returns the latest version of each major version, or of each minor with includeMinor
 */
export function getLatestVersionHeads(tags: string[], includeMinor = false) {
  let heads = new Map<string, string>();
  for (let tag of tags) {
    let prefix = String(semver.major(tag));
    if (includeMinor) {
      prefix += "." + semver.minor(tag);
    }
    let head = heads.get(prefix);
    if (!head || semver.gt(tag, head)) {
      heads.set(prefix, tag);
    }
  }
  return Array.from(heads.values()).sort(semver.compare).reverse();
}

// Every product's releases come from the one repository, so the cache holds its tag names
// once and getTags filters them per prefix.
// global for SS "HMR", we need a better story here
global.releasesCache ??= new LRUCache<string, string[], CacheContext>({
  max: 3,
  ttl: env.NO_CACHE ? 1 : 1000 * 60 * 5, // 5 minutes, so we can see new tags quickly
  allowStale: !env.NO_CACHE,
  noDeleteOnFetchRejection: true,
  fetchMethod: async (key, _, { context }) => {
    console.log("Fetching fresh releases", key);
    let [owner, repo] = key.split("/");
    return getAllReleases(owner, repo, context);
  },
});

/**
 * Retrieves the tag names of every published release.
 */
export async function getAllReleases(
  owner: string,
  repo: string,
  { octokit }: CacheContext,
): Promise<string[]> {
  let releases = await octokit.paginate(octokit.rest.repos.listReleases, {
    owner,
    repo,
    per_page: 100,
  });
  return releases
    .filter((release) => !release.draft)
    .map((release) => release.tag_name);
}
