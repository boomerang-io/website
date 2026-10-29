import path from "path";
import { Readable } from "stream";
import type { ReadableStream } from "stream/web";
import * as tar from "tar";
import invariant from "tiny-invariant";
import { env } from "~/utils/env.server";

/**
 * Fetches a repo tarball from GitHub or your local repo as a tarball in
 * development.
 *
 * @param ref GitHub ref (main, flow@4.0.0, etc.) use "local" for local repo.
 * @param pathToDocs The product's folder, the only part of a local repo that is packed.
 * @returns The repo tarball
 */
export async function getRepoTarballStream(
  repo: string,
  ref: string,
  pathToDocs: string,
): Promise<NodeJS.ReadableStream> {
  if (ref === "local") {
    console.log("Using local repo");
    invariant(
      env.LOCAL_REPO_RELATIVE_PATH,
      "LOCAL_REPO_RELATIVE_PATH is not set",
    );
    return createTarballStream(
      path.join(process.cwd(), env.LOCAL_REPO_RELATIVE_PATH),
      pathToDocs,
    );
  }

  let tarballURL = `https://github.com/${repo}/archive/${ref}.tar.gz`;
  let response = await fetch(tarballURL);
  if (!response.ok || !response.body) {
    throw new Error(`Could not fetch ${tarballURL}: ${response.status}`);
  }
  return Readable.fromWeb(response.body as ReadableStream);
}

/**
 * Packs a folder of a local checkout with the same "<root>/<folder>/..." layout as a GitHub
 * archive, so the rest of the code works the same for local dev as in production.
 */
export function createTarballStream(
  cwd: string,
  folder: string,
): NodeJS.ReadableStream {
  return Readable.from(tar.create({ gzip: true, cwd, prefix: "local" }, [folder]));
}
