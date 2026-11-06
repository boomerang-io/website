import * as React from "react";
import {
  Link,
  data,
  isRouteErrorResponse,
  redirect,
  useLoaderData,
  useLocation,
  useParams,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import type {
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import { CACHE_CONTROL, handleRedirects, publicOrigin } from "~/utils/http.server";
import invariant from "tiny-invariant";
import type { Doc } from "~/utils/github";
import { getRepoDoc } from "~/utils/github";
import iconsHref from "~/icons.svg";
import { useDelegatedReactRouterLinks } from "~/components/delegate-links";
import cx from "clsx";
import {
  findMenuCategory,
  type loader as docsLayoutLoader,
} from "~/routes/docs.$product.$ref";
import type { loader as rootLoader } from "~/root";
import { getMeta } from "~/utils/meta";
import {
  docConfig,
  getDocRedirect,
  getGitHubRef,
  getProduct,
} from "~/config/doc";
import { siteConfig } from "~/config/site";
import { isImage } from "~/routes/docs.$product.$ref.images.$";

export async function loader({ params, request }: LoaderFunctionArgs) {
  let url = new URL(request.url);
  let baseUrl = publicOrigin(request);
  let siteUrl = baseUrl + url.pathname;
  //TODO - figure out og.1.jpg
  let ogImageUrl = baseUrl + "/img/og.1.jpg";
  invariant(params.ref, "expected `ref` params");
  let product = getProduct(params.product);
  // Not a product: the layout loader redirects to the canonical URL.
  if (!product) throw data(null, { status: 404 });

  // Markdown images are relative to the page, so they arrive here: hand them to the image route.
  if (isImage(params["*"])) {
    console.log("Redirecting to image: ", params["*"]);
    throw redirect(`/docs/${product}/${params.ref}/images/${params["*"]}`);
  }

  let { pathToDocs, releaseBranch } = docConfig.products[product];
  try {
    let slug = params["*"]?.endsWith("/changelog")
      ? "CHANGELOG"
      : `${pathToDocs}/${params["*"] || "index"}`;
    let doc = await getRepoDoc(getGitHubRef(product, params.ref), slug);
    if (!doc) throw null;
    return data(
      { doc, siteUrl, ogImageUrl },
      { headers: { "Cache-Control": CACHE_CONTROL.DEFAULT } }
    );
  } catch (_) {
    if (params.ref === releaseBranch && params["*"]) {
      // Only perform redirects for 404's on the release branch, which are likely being
      // redirected from the root `/docs/{slug}` or a page that moved.  If someone is direct
      // linking to a missing slug on an old version or tag, then a 404 feels appropriate.
      let moved = getDocRedirect(product, params.ref, params["*"]);
      if (moved) throw redirect(moved, 301);
      handleRedirects(url.pathname);
    }
    throw data(null, { status: 404 });
  }
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  // Inherit the caching headers from the loader so we don't cache 404s
  let headers = new Headers(loaderHeaders);
  headers.set("Vary", "Cookie");
  return headers;
};

const LAYOUT_LOADER_KEY = "routes/docs.$product.$ref";

type Loader = typeof loader;
type MatchLoaders = {
  [LAYOUT_LOADER_KEY]: typeof docsLayoutLoader;
  root: typeof rootLoader;
};

export const meta: MetaFunction<Loader, MatchLoaders> = (args) => {
  let { data } = args;

  let parentData = args.matches.find(
    (match) => match.id === LAYOUT_LOADER_KEY
  )?.data;
  let rootData = args.matches.find((match) => match.id === "root")?.data;
  invariant(rootData && "isProductionHost" in rootData, "No root data found");

  if (!data || !parentData) {
    return [{ title: "Not Found" }];
  }

  let { doc } = data;

  let { latestVersion, releaseBranch, branches, currentRef, product } =
    parentData;

  let titleAppend =
    currentRef === releaseBranch || currentRef === latestVersion
      ? ""
      : branches.includes(currentRef)
      ? ` (${currentRef} branch)`
      : ` (${currentRef})`;

  let title = doc.attrs.title + titleAppend;
  let description = doc.attrs.description ?? siteConfig.description;

  // seo: only want to index the main branch
  let isMainBranch = currentRef === releaseBranch;

  let robots =
    rootData.isProductionHost && isMainBranch
      ? "index,follow"
      : "noindex,nofollow";

  let { siteUrl, ogImageUrl } = data;

  return getMeta({
    title: `${title} | ${docConfig.products[product].title}`,
    description: `${description}`,
    siteUrl,
    image: ogImageUrl,
    additionalMeta: [
      { name: "og:type", content: "article" },
      { name: "og:site_name", content: `${siteConfig.name}` },
      { name: "docsearch:language", content: "en" },
      { name: "docsearch:version", content: args.params.ref || "v1" },
      { name: "robots", content: robots },
      { name: "googlebot", content: robots },
    ],
  });
};

export default function DocPage() {
  let { doc } = useLoaderData<typeof loader>();
  let layoutData = useRouteLoaderData<typeof docsLayoutLoader>(LAYOUT_LOADER_KEY);
  let { "*": splat } = useParams();
  let category = findMenuCategory(layoutData?.menu, splat);
  let product = getProduct(layoutData?.product);
  let ref = React.useRef<HTMLDivElement>(null);
  useDelegatedReactRouterLinks(ref);
  useMarkdownTabs(ref);
  let showTOC = doc.attrs.toc !== false && doc.headings.length > 3;

  return (
    <div className="xl:flex xl:w-full xl:justify-between xl:gap-12">
      {showTOC ? (
        <LargeOnThisPage doc={doc} />
      ) : (
        <div className="hidden xl:order-1 xl:block xl:w-56 xl:flex-shrink-0" />
      )}
      <div className="min-w-0 xl:flex-grow">
        <div className="max-w-[760px] pb-12 pt-10 lg:pt-12">
          <header className="mb-6 flex flex-col gap-4">
            {category && (
              // Phones show the category in the menu bar instead
              <p className="hidden font-mono text-xs uppercase tracking-[0.12em] text-brand-muted lg:block">
                {category} / {doc.attrs.title}
              </p>
            )}
            {doc.title && (
              <div className="md-prose">
                <h1
                  id={doc.title.slug}
                  dangerouslySetInnerHTML={{ __html: doc.title.html }}
                />
              </div>
            )}
            <PageMeta
              verified={doc.attrs.verified}
              productName={
                product
                  ? docConfig.products[product].title.replace(/^Boomerang /, "")
                  : undefined
              }
            />
          </header>
          {showTOC && <SmallOnThisPage doc={doc} />}
          <div ref={ref} className="markdown">
            <div
              className={cx("md-prose", doc.title && "has-title")}
              dangerouslySetInnerHTML={{ __html: doc.html }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const pageActionClassName =
  "inline-flex h-11 items-center rounded-md border border-brand-edge bg-white px-3 font-medium text-brand-ink hover:bg-brand-canvas sm:h-9";

/*
 * Under the title: the version the page was verified against (frontmatter `verified`) and the
 * page as Markdown, copied or opened at /<page>.md.
 */
function PageMeta({
  verified,
  productName,
}: {
  verified?: string | number;
  productName?: string;
}) {
  let { pathname } = useLocation();
  let markdownUrl = `${pathname.replace(/\/$/, "")}.md`;
  let [status, setStatus] = React.useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      let response = await fetch(markdownUrl);
      if (!response.ok) throw new Error(String(response.status));
      await navigator.clipboard.writeText(await response.text());
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
      {verified ? (
        <p className="flex items-center gap-2 text-brand-muted">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 text-brand-teal" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M3 8.5l3 3 7-7" />
          </svg>
          Verified against {productName} {String(verified)}
        </p>
      ) : (
        <span aria-hidden="true" />
      )}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copy} className={pageActionClassName}>
          <span aria-live="polite">
            {status === "copied"
              ? "Copied"
              : status === "failed"
                ? "Copy failed"
                : "Copy page as Markdown"}
          </span>
        </button>
        <a href={markdownUrl} className={pageActionClassName}>
          View as Markdown
        </a>
      </div>
    </div>
  );
}

/**
 * Wires up the tab blocks remarkTabs renders (md-plugins.server.ts): click or arrow keys select a
 * tab and show its panel.
 */
function useMarkdownTabs(ref: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    let root = ref.current;
    if (!root) return;
    let tabSelector = '[data-md-tabs] [role="tab"]';

    let select = (tab: HTMLElement) => {
      let group = tab.closest("[data-md-tabs]");
      if (!group) return;
      group
        .querySelectorAll<HTMLElement>(':scope > [role="tablist"] > [role="tab"]')
        .forEach((each) => {
          let selected = each.dataset.tab === tab.dataset.tab;
          each.setAttribute("aria-selected", String(selected));
          each.tabIndex = selected ? 0 : -1;
        });
      group
        .querySelectorAll<HTMLElement>(':scope > [role="tabpanel"]')
        .forEach((panel) => {
          panel.hidden = panel.dataset.panel !== tab.dataset.tab;
        });
    };

    let onClick = (event: MouseEvent) => {
      let tab = (event.target as Element).closest<HTMLElement>(tabSelector);
      if (tab) select(tab);
    };

    let onKeyDown = (event: KeyboardEvent) => {
      let tab = (event.target as Element).closest<HTMLElement>(tabSelector);
      if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      let tabs = Array.from(
        tab.parentElement?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []
      );
      let index = tabs.indexOf(tab);
      let next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      event.preventDefault();
      tabs[next].focus();
      select(tabs[next]);
    };

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    };
  }, [ref]);
}

/**
 * The heading currently at the top of the reading area, for the "On this page" highlight.
 */
function useActiveHeading(slugs: (string | undefined)[]) {
  let [active, setActive] = React.useState<string>();
  let key = slugs.join("|");

  React.useEffect(() => {
    let elements = key
      .split("|")
      .flatMap((slug) => {
        let element = slug ? document.getElementById(slug) : null;
        return element ? [element] : [];
      });
    if (elements.length === 0) return;

    let observer = new IntersectionObserver(
      (entries) => {
        let visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // a band just under the sticky header
      { rootMargin: "-80px 0px -70% 0px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

function TocLinks({ doc, className }: { doc: Doc; className?: string }) {
  let active = useActiveHeading(doc.headings.map((heading) => heading.slug));
  return (
    <ul className={cx("md-toc flex flex-col gap-3 text-sm leading-[1.3]", className)}>
      {doc.headings.map((heading, i) => (
        <li key={i} className={heading.headingLevel === "h2" ? undefined : "pl-3.5"}>
          <Link
            to={`#${heading.slug}`}
            aria-current={active === heading.slug ? "location" : undefined}
            dangerouslySetInnerHTML={{ __html: heading.html || "" }}
            className={
              active === heading.slug
                ? "font-medium text-brand-teal"
                : "text-brand-muted hover:text-brand-ink"
            }
          />
        </li>
      ))}
    </ul>
  );
}

function LargeOnThisPage({ doc }: { doc: Doc }) {
  return (
    <nav
      aria-label="On this page"
      className="sticky top-24 order-1 mt-14 hidden max-h-[calc(100vh-8rem)] w-56 flex-shrink-0 self-start overflow-y-auto pb-10 xl:block"
    >
      <p className="mb-3.5 font-mono text-xs tracking-[0.12em] text-brand-muted">
        ON THIS PAGE
      </p>
      <TocLinks doc={doc} />
    </nav>
  );
}

function SmallOnThisPage({ doc }: { doc: Doc }) {
  return (
    <details className="group mb-6 rounded-md border border-brand-edge xl:hidden">
      <summary className="_no-triangle flex min-h-11 cursor-pointer select-none items-center justify-between px-3.5 text-[15px] font-medium">
        On this page
        <svg aria-hidden className="h-4 w-4 text-brand-muted group-open:hidden">
          <use href={`${iconsHref}#chevron-r`} />
        </svg>
        <svg aria-hidden className="hidden h-4 w-4 text-brand-muted group-open:block">
          <use href={`${iconsHref}#chevron-d`} />
        </svg>
      </summary>
      <nav aria-label="On this page" className="border-t border-brand-line px-3.5 py-3">
        <TocLinks doc={doc} />
      </nav>
    </details>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();
  let params = useParams();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3">
        <h1 className="font-mono text-7xl font-medium text-brand-ink">{error.status}</h1>
        <p className="text-lg text-brand-muted">
          {[400, 404].includes(error.status) ? (
            <>
              There is no doc for{" "}
              <code className="rounded border border-brand-line bg-brand-canvas px-1.5 font-mono text-base text-brand-ink">
                {params["*"]}
              </code>
            </>
          ) : (
            error.statusText
          )}
        </p>
      </div>
    );
  }
  throw error;
}
