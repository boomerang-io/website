import { redirect, type Params } from "react-router";
import {
  docConfig,
  getDocRedirect,
  getGitHubRef,
  getProduct,
} from "~/config/doc";
import { getRepoMarkdown } from "~/utils/github";
import { CACHE_CONTROL, publicOrigin } from "~/utils/http.server";
import { absolutizeLinks } from "~/utils/llms";

function notFound() {
  return new Response("Not found\n", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/**
 * Serves `/docs/<product>/<ref>/<slug>.md` as the page's markdown, or null for any other URL.
 * Called from the docs layout's middleware, so it answers before the page loaders run.
 */
export async function markdownResponse(
  request: Request,
  params: Params
): Promise<Response | null> {
  let url = new URL(request.url);
  if (!url.pathname.endsWith(".md")) return null;

  let product = getProduct(params.product);
  if (!product) return notFound();

  // /docs/flow/main.md is the product's index page
  let ref = params.ref ?? "";
  let splat = params["*"];
  if (splat) {
    splat = splat.slice(0, -".md".length);
  } else {
    ref = ref.replace(/\.md$/, "");
  }

  let { pathToDocs } = docConfig.products[product];
  try {
    let markdown = await getRepoMarkdown(
      getGitHubRef(product, ref),
      `${pathToDocs}/${splat || "index"}`
    );
    if (markdown === undefined) return notFound();
    let pageUrl = publicOrigin(request) + url.pathname.slice(0, -".md".length);
    return new Response(absolutizeLinks(markdown, pageUrl) + "\n", {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": CACHE_CONTROL.DEFAULT,
      },
    });
  } catch {
    let moved = getDocRedirect(product, ref, splat);
    return moved ? redirect(`${moved}.md`, 301) : notFound();
  }
}
