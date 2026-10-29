import {
  meta,
  loader,
  headers,
  ErrorBoundary,
  default as DocsPage,
} from "~/routes/docs.$product.$ref.$";

function SplatPage() {
  return <DocsPage />;
}

export default SplatPage;
export { meta, loader, headers, ErrorBoundary };
