import { type LoaderFunctionArgs } from "@remix-run/node";
import * as React from "react";
import { json } from "@remix-run/node";
import { handleRedirects } from "~/utils/http.server";
import invariant from "tiny-invariant";
import { getRepoImage } from "~/utils/github";
import { docConfig } from "~/config/doc";

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.ref, "expected `ref` params");
  try {
    let pathPrefix = docConfig.pathToDocs ? `${docConfig.pathToDocs}/` : "";
    let slug = `${pathPrefix}${params["*"]}`;
    console.log("Retrieving image: ", slug);
    let image = await getRepoImage(params.ref, slug);
    if (!image) throw null;

    // Determine the content type based on the file extension
    let contentType = "image/png"; // Default to PNG
    if (params["*"]?.endsWith(".svg")) contentType = "image/svg+xml";
    if (params["*"]?.endsWith(".gif")) contentType = "image/gif";

    return new Response(image, {
      headers: {
        "Content-Type": contentType,
        // starting with 1 day, may need to be lo
        // nger as these images don't change often
        // could also make it dependent on the date of the post
        "Cache-Control": `max-age=${60 * 60 * 24}`,
      },
    });
  } catch (_) {
    console.log("Image not found: ", params["*"]);
    if (params.ref === "main" && params["*"]) {
      // Only perform redirects for 404's on `main` URLs which are likely being
      // redirected from the root `/docs/{slug}`.  If someone is direct linking
      // to a missing slug on an old version or tag, then a 404 feels appropriate.
      handleRedirects(`/docs/${params["*"]}`);
    }
    throw json(null, { status: 404 });
  }
}
