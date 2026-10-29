import { LRUCache } from "lru-cache";
import type { Octokit } from "octokit";
import { env } from "~/utils/env.server";

type CacheContext = { octokit: Octokit };

declare global {
  var branchesCache: LRUCache<string, string[], CacheContext>;
}

export async function getBranches(repo: string, { octokit }: CacheContext) {
  return branchesCache.fetch(repo, {
    context: { octokit },
  });
}

global.branchesCache ??= new LRUCache<string, string[], CacheContext>({
  max: 3,
  ttl: env.NO_CACHE ? 1 : 1000 * 60 * 5, // 5 minutes, so we can see new tags quickly
  allowStale: !env.NO_CACHE,
  noDeleteOnFetchRejection: true,
  fetchMethod: fetchBranches,
});

async function fetchBranches(
  key: string,
  staleValue: string[] | undefined,
  { context }: LRUCache.FetchOptionsWithContext<string, string[], CacheContext>,
) {
  console.log("Fetching fresh branches", key);
  let [owner, repo] = key.split("/");
  let branches = await context.octokit.paginate(
    context.octokit.rest.repos.listBranches,
    { owner, repo, per_page: 100 },
  );
  return branches.map((branch) => branch.name);
}
