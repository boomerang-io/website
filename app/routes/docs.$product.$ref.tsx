import * as React from "react";
import {
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigation,
  useParams,
  useResolvedPath,
  matchPath,
} from "react-router";
import type { LoaderFunctionArgs, HeadersFunction } from "react-router";
import cx from "clsx";
import invariant from "tiny-invariant";
import "~/styles/docs.css";
import { DetailsMenu } from "~/components/details-menu";
import iconsHref from "~/icons.svg";
import {
  REPO_URL,
  getRepoBranches,
  getRepoDocsMenu,
  getRepoTags,
  validateParams,
  getLatestVersion,
  getLatestVersionHeads,
} from "~/utils/github";
import type { Doc } from "~/utils/github";
import { octokit } from "~/utils/github.server";
import { CACHE_CONTROL } from "~/utils/http.server";
import { VersionWarningMessage } from "~/components/version-warning-message";
import { siteConfig } from "~/config/site";
import type { MenuDoc } from "~/utils/github/docs";
import { docConfig, getGitHubRef, getProduct } from "~/config/doc";
import { Header } from "~/components/header";
import { Badge } from "~/components/ui/badge";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  let { product: productParam, ref = "", "*": splat } = params;
  invariant(productParam, "expected `product` params");

  let product = getProduct(productParam) ?? docConfig.defaultProduct;
  let config = docConfig.products[product];
  let [tags, repoBranches] = await Promise.all([
    getRepoTags({ octokit, releasePrefix: config.versions.prefix }),
    getRepoBranches({ octokit }),
  ]);

  if (!tags || !repoBranches) {
    throw new Response("Cannot reach GitHub", { status: 503 });
  }

  let branches = [...repoBranches];
  let branchesInMenu = [...config.branches];
  if (process.env.NODE_ENV === "development") {
    branches.push("local");
    branchesInMenu.push("local");
  }

  let betterUrl = validateParams(
    tags,
    branches,
    { product: productParam, ref, "*": splat },
    product,
  );
  if (betterUrl) {
    console.log("Redirecting to better URL: ", betterUrl);
    throw redirect("/docs/" + betterUrl);
  }

  let latestVersion = getLatestVersion(tags);
  let versions = getLatestVersionHeads(tags, config.versions.includeMinor);

  let githubRef = getGitHubRef(product, ref);
  let menu = await getRepoDocsMenu(githubRef, config.pathToDocs);
  let releaseBranch = config.releaseBranch;
  let isLatest = ref === releaseBranch || ref === latestVersion;

  return {
    menu,
    versions,
    latestVersion,
    releaseBranch,
    branches: branchesInMenu,
    currentRef: ref,
    githubRef,
    product,
    products: Object.entries(docConfig.products).map(([key, { title }]) => ({
      key,
      title,
    })),
    isLatest,
    isEditable: config.branches.includes(ref),
    repoUrl: REPO_URL,
  };
};

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": CACHE_CONTROL.DEFAULT,
    Vary: "Cookie",
  };
};

export default function DocsLayout() {
  let params = useParams();
  let navigation = useNavigation();
  let navigating =
    navigation.state === "loading" && navigation.formData == null;
  let changingVersions =
    navigating &&
    params.ref &&
    // TODO: we should have `transition.params`
    !navigation.location!.pathname.match(params.ref);

  let versionData = useLoaderData<typeof loader>();

  return (
    <div className="[--header-height:theme(spacing.16)] [--nav-width:280px]">
      <div className="sticky top-0 z-20">
        <Header versionData={versionData} />
        <VersionWarning />
        <NavMenuMobile />
      </div>
      <div
        className={
          changingVersions
            ? "opacity-25 transition-opacity delay-300"
            : undefined
        }
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="block lg:flex">
            <NavMenuDesktop />
            <div
              className={cx(
                // add scroll margin to focused elements so that they aren't
                // obscured by the sticky header
                "[&_*:focus]:scroll-mt-[8rem] lg:[&_*:focus]:scroll-mt-[5rem]",
                // Account for the left navbar
                "min-h-[80vh] min-w-0 lg:w-[calc(100%-var(--nav-width))] lg:pl-10 xl:pl-14",
                !changingVersions && navigating
                  ? "opacity-25 transition-opacity delay-300"
                  : ""
              )}
            >
              <Outlet />
              <div className="max-w-[760px] pb-16">
                <DocsFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The menu category a page sits in, for the breadcrumb and the phone menu bar.
 */
export function findMenuCategory(
  menu: MenuDoc[] | undefined,
  splat: string | undefined
): string | undefined {
  if (!menu || !splat) return undefined;
  return menu.find(
    (category) =>
      category.slug === splat ||
      category.children.some((doc) => doc.slug === splat)
  )?.attrs.title;
}

function DocsFooter() {
  return (
    <div className="flex flex-wrap justify-between gap-x-6 gap-y-3 border-t border-brand-line pt-6 text-[15px]">
      <EditLink />
      <span className="text-brand-muted">
        Docs and examples licensed under{" "}
        <a className="hover:underline" href={siteConfig.license.url}>
          {siteConfig.license.name}
        </a>
      </span>
    </div>
  );
}

function VersionWarning() {
  let { isLatest, branches, currentRef, product, releaseBranch } =
    useLoaderData<typeof loader>();
  let { "*": splat } = useParams();
  if (isLatest) return null;

  return (
    <div className="bg-brand-ink px-4 py-2.5 text-center text-sm text-white">
      <VersionWarningMessage
        branches={branches}
        currentRef={currentRef}
        latestPath={`/docs/${product}/${releaseBranch}`}
        splat={splat}
      />
    </div>
  );
}

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg aria-hidden className="h-4 w-4 shrink-0 text-brand-muted">
      <use href={`${iconsHref}#${open ? "chevron-d" : "chevron-r"}`} />
    </svg>
  );
}

function NavMenuMobile() {
  let doc = useDoc();
  let { menu, product, products } = useLoaderData<typeof loader>();
  let { "*": splat } = useParams();
  let productTitle = products.find(({ key }) => key === product)?.title;
  let category = findMenuCategory(menu, splat);

  return (
    <div className="lg:hidden">
      <DetailsMenu className="group/menu relative flex flex-col">
        <summary className="_no-triangle flex min-h-[52px] cursor-pointer select-none items-center justify-between gap-3 border-b border-brand-line bg-[#F7F9FB] px-4">
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-brand-muted">
              {[productTitle, category].filter(Boolean).join(" · ")}
            </span>
            <span className="truncate font-semibold">
              {doc ? doc.attrs.title : "Navigation"}
            </span>
          </span>
          <span className="group-open/menu:hidden">
            <Chevron />
          </span>
          <span className="hidden group-open/menu:block">
            <Chevron open />
          </span>
        </summary>
        <div className="absolute inset-x-0 top-full max-h-[70vh] overflow-auto overscroll-contain border-b border-brand-line bg-white px-4 py-4 shadow-xl">
          <Menu />
        </div>
      </DetailsMenu>
    </div>
  );
}

function NavMenuDesktop() {
  return (
    <div
      className={cx(
        "sticky top-16 hidden w-[--nav-width] shrink-0 flex-col self-start overflow-auto border-r border-brand-line pb-10 pr-5 pt-8 lg:flex",
        // Account for the height of the top nav
        "h-[calc(100vh-var(--header-height))]"
      )}
    >
      <div className="[&_*:focus]:scroll-mt-[6rem]">
        <Menu />
      </div>
    </div>
  );
}

function Menu() {
  let { menu } = useLoaderData<typeof loader>();

  return menu ? (
    <nav aria-label="Documentation">
      <ul className="flex flex-col gap-1">
        {menu.map((category) => {
          // Technically we can have a category that has content (and thus
          // needs it's own link) _and_ has children, so needs to be a details
          // element. It's ridiculous, but it's possible.
          const menuCategoryType = category.hasContent
            ? category.children.length > 0
              ? "linkAndDetails"
              : "link"
            : "details";

          return (
            <li key={category.attrs.title}>
              {menuCategoryType === "link" ? (
                <MenuSummary as="div">
                  <MenuCategoryLink to={category.slug}>
                    {category.attrs.title}
                  </MenuCategoryLink>
                </MenuSummary>
              ) : (
                <MenuCategoryDetails className="group/category" slug={category.slug}>
                  <MenuSummary>
                    {menuCategoryType === "linkAndDetails" ? (
                      <MenuCategoryLink to={category.slug}>
                        {category.attrs.title}
                      </MenuCategoryLink>
                    ) : (
                      category.attrs.title
                    )}
                    <span className="group-open/category:hidden">
                      <Chevron />
                    </span>
                    <span className="hidden group-open/category:block">
                      <Chevron open />
                    </span>
                  </MenuSummary>
                  <ul className="mb-2 ml-3 mt-1 flex flex-col gap-0.5 border-l border-brand-line pl-3">
                    {category.children.map((doc) => (
                      <li key={doc.slug}>
                        <MenuLink to={doc.slug}>
                          {doc.attrs.title}
                          {doc.attrs.tag && (
                            <Badge variant="outline" className="font-mono !font-normal">
                              {doc.attrs.tag}
                            </Badge>
                          )}
                        </MenuLink>
                      </li>
                    ))}
                  </ul>
                </MenuCategoryDetails>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  ) : (
    <div className="text-brand-muted">Failed to load menu</div>
  );
}

type MenuCategoryDetailsType = {
  className?: string;
  slug: string;
  children: React.ReactNode;
};

function MenuCategoryDetails({
  className,
  slug,
  children,
}: MenuCategoryDetailsType) {
  const isActivePath = useIsActivePath(slug);
  // By default only the active path is open
  const [isOpen, setIsOpen] = React.useState(isActivePath);

  // Auto open the details element, useful when navigating from the home page
  React.useEffect(() => {
    if (isActivePath) {
      setIsOpen(true);
    }
  }, [isActivePath]);

  return (
    <details
      className={cx(className, "relative flex flex-col")}
      open={isOpen}
      onToggle={(e) => {
        // Synchronize the DOM's state with React state to prevent the
        // details element from being closed after navigation and re-evaluation
        // of useIsActivePath
        setIsOpen(e.currentTarget.open);
      }}
    >
      {children}
    </details>
  );
}

// This components attempts to keep all of the styles as similar as possible
function MenuSummary({
  children,
  as = "summary",
}: {
  children: React.ReactNode;
  as?: "summary" | "div";
}) {
  const sharedClassName =
    "flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-3 text-[15px] font-semibold text-brand-ink";

  if (as === "summary") {
    return (
      <summary
        className={cx(
          sharedClassName,
          "_no-triangle cursor-pointer select-none hover:bg-brand-canvas",
          "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-blue"
        )}
      >
        {children}
      </summary>
    );
  }

  return (
    <div
      className={cx(
        sharedClassName,
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-brand-blue"
      )}
    >
      {children}
    </div>
  );
}

function MenuCategoryLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  let isActive = useIsActivePath(to);

  return (
    <Link
      prefetch="intent"
      to={to}
      className={cx(
        "outline-none",
        isActive ? "text-brand-teal" : "hover:text-brand-link"
      )}
    >
      {children}
    </Link>
  );
}

function MenuLink({ to, children }: { to: string; children: React.ReactNode }) {
  let isActive = useIsActivePath(to);
  return (
    <Link
      prefetch="intent"
      to={to}
      aria-current={isActive ? "page" : undefined}
      className={cx(
        "flex items-center justify-between gap-2 rounded-md px-3 py-[7px] text-[15px]",
        "outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-blue",
        isActive
          ? "bg-brand-canvas font-medium text-brand-ink"
          : "text-brand-muted hover:bg-brand-canvas hover:text-brand-ink"
      )}
    >
      {children}
    </Link>
  );
}

/*
 * Generates a link to GitHub in the footer. View for tags. Edit for branches.
 */
function EditLink() {
  let doc = useDoc();
  let { repoUrl, githubRef, isEditable } = useLoaderData<typeof loader>();
  // TODO: deal with translations when we add them
  if (!doc) return null;

  // doc.slug is the path in the repository, product folder included
  let [text, url] = isEditable
    ? ["Edit this page on GitHub →", `${repoUrl}/edit/${githubRef}/${doc.slug}.md`]
    : ["View this page on GitHub →", `${repoUrl}/blob/${githubRef}/${doc.slug}.md`];

  return (
    <a
      className="font-medium text-brand-link hover:underline"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {text}
    </a>
  );
}

function hasDoc(data: unknown): data is { doc: Doc } {
  return !!data && typeof data === "object" && "doc" in data;
}

function useDoc(): Doc | null {
  let data = useMatches().at(-1)?.data;
  if (!hasDoc(data)) return null;
  return data.doc;
}

function useIsActivePath(to: string) {
  let { pathname } = useResolvedPath(to);
  let navigation = useNavigation();
  let currentLocation = useLocation();
  let navigating =
    navigation.state === "loading" && navigation.formData == null;
  let location = navigating ? navigation.location! : currentLocation;
  let match = matchPath(pathname + "/*", location.pathname);
  return Boolean(match);
}
