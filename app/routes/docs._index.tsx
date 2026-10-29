import { redirect } from "react-router";
import { docConfig } from "~/config/doc";

export async function loader() {
  let { defaultProduct, products } = docConfig;
  return redirect(
    `/docs/${defaultProduct}/${products[defaultProduct].releaseBranch}`,
    { status: 301 },
  );
}
