import type { LoaderFunctionArgs } from "react-router";
import { docConfig, type Product } from "~/config/doc";
import { siteConfig } from "~/config/site";
import { getRepoDocsMenu } from "~/utils/github";
import { CACHE_CONTROL, publicOrigin } from "~/utils/http.server";
import { buildLlmsTxt } from "~/utils/llms";

/*
 * /llms.txt: an index of every docs page on each product's release branch, for LLMs and agents.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  let origin = publicOrigin(request);
  let sections = await Promise.all(
    (Object.keys(docConfig.products) as Product[]).map(async (product) => {
      let { title, releaseBranch, pathToDocs } = docConfig.products[product];
      let menu = await getRepoDocsMenu(releaseBranch, pathToDocs).catch(() => undefined);
      return { title, baseUrl: `${origin}/docs/${product}/${releaseBranch}`, menu: menu ?? [] };
    })
  );

  return new Response(
    buildLlmsTxt(siteConfig.name, siteConfig.description, sections),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": CACHE_CONTROL.DEFAULT,
      },
    }
  );
}
