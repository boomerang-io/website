import { data, type LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { getRepoImage } from "~/utils/github";
import { docConfig, getGitHubRef, getProduct } from "~/config/doc";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function getContentType(path: string | undefined) {
  let extension = path?.slice(path.lastIndexOf(".")).toLowerCase();
  return extension ? CONTENT_TYPES[extension] : undefined;
}

export function isImage(path: string | undefined) {
  return !!getContentType(path);
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.ref, "expected `ref` params");
  let product = getProduct(params.product);
  let contentType = getContentType(params["*"]);
  if (!product || !contentType) throw data(null, { status: 404 });

  try {
    let slug = `${docConfig.products[product].pathToDocs}/${params["*"]}`;
    console.log("Retrieving image: ", slug);
    let image = await getRepoImage(getGitHubRef(product, params.ref), slug);
    if (!image) throw null;

    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": contentType,
        // starting with 1 day, may need to be longer as these images don't change often
        // could also make it dependent on the date of the post
        "Cache-Control": `max-age=${60 * 60 * 24}`,
      },
    });
  } catch (_) {
    console.log("Image not found: ", params["*"]);
    throw data(null, { status: 404 });
  }
}
