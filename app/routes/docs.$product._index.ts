import { redirect, type LoaderFunctionArgs } from "react-router";
import iso_639_1 from "iso-639-1";
import { docConfig, getProduct } from "~/config/doc";

export async function loader({ params }: LoaderFunctionArgs) {
  let product = getProduct(params.product);
  if (product) {
    return redirect(
      `/docs/${product}/${docConfig.products[product].releaseBranch}`,
    );
  }

  // Not a product: an earlier language URL (/docs/en) or a slug on the default product.
  let { defaultProduct, products } = docConfig;
  let path = [defaultProduct, products[defaultProduct].releaseBranch];
  if (!iso_639_1.validate(params.product ?? "")) path.push(params.product!);
  return redirect(`/docs/${path.join("/")}`);
}
