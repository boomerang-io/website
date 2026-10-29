import { getDoc, getMenu, getImage } from "./docs";
import { getBranches } from "./branches";
import { getTags } from "./tags";
import type { Octokit } from "octokit";
import { env } from "~/utils/env.server";

export { validateParams } from "./params";
export { getRepoTarballStream } from "./repo-tarball";
export {
  getLatestVersion,
  getAllReleases,
  getLatestVersionHeads,
} from "./tags";

export type { Doc } from "./docs";

const REPO = env.SOURCE_REPO;

export const REPO_URL = `https://github.com/${REPO}`;

export function getRepoTags({
  octokit,
  releasePrefix,
}: {
  octokit: Octokit;
  releasePrefix: string;
}) {
  return getTags(REPO, { octokit, releasePrefix });
}

export function getRepoBranches({ octokit }: { octokit: Octokit }) {
  return getBranches(REPO, { octokit });
}

export function getRepoDocsMenu(ref: string, pathToDocs: string) {
  return getMenu(REPO, ref, pathToDocs);
}

export function getRepoDoc(ref: string, slug: string) {
  return getDoc(REPO, ref, slug);
}

export function getRepoImage(ref: string, slug: string) {
  return getImage(REPO, ref, slug);
}
