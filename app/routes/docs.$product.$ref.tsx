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

  let location = useLocation();
  let detailsRef = React.useRef<HTMLDetailsElement>(null);

  React.useEffect(() => {
    let details = detailsRef.current;
    if (details && details.hasAttribute("open")) {
      details.removeAttribute("open");
    }
  }, [location]);

  let docsContainer = React.useRef<HTMLDivElement>(null);

  let versionData = useLoaderData<typeof loader>();

  return (
    <div className="[--header-height:theme(spacing.16)] [--nav-width:theme(spacing.72)]">
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
        <InnerContainer>
          <div className="block lg:flex">
            <NavMenuDesktop />
            <div
              ref={docsContainer}
              className={cx(
                // add scroll margin to focused elements so that they aren't
                // obscured by the sticky header
                "[&_*:focus]:scroll-mt-[8rem] lg:[&_*:focus]:scroll-mt-[5rem]",
                // Account for the left navbar
                "min-h-[80vh] lg:ml-3 lg:w-[calc(100%-var(--nav-width))]",
                "lg:pl-6 xl:pl-10 2xl:pl-12",
                !changingVersions && navigating
                  ? "opacity-25 transition-opacity delay-300"
                  : ""
              )}
            >
              <Outlet />
              <div className="pt-8 sm:pt-10 lg:pt-12">
                <Footer />
              </div>
            </div>
          </div>
        </InnerContainer>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="place-content-center flex justify-between gap-4 border-t border-t-gray-50 py-4 text-sm text-gray-400 dark:border-gray-800">
      <div className="sm:flex sm:items-center sm:gap-2 lg:gap-4">
        <div>
          &copy; 2024{" "}
          <a className="hover:underline" href={siteConfig.url}>
            {siteConfig.project}
          </a>
          . All rights reserved.
        </div>
        <div className="hidden sm:block">•</div>
        <div>
          Docs and examples licensed under{" "}
          <a className="hover:underline" href={siteConfig.license.url}>
            {siteConfig.license.name}
          </a>
        </div>
        <div className="hidden sm:block">•</div>
        <div>
          <EditLink />
        </div>
      </div>
    </div>
  );
}

function VersionWarning() {
  let { isLatest, branches, currentRef, product, releaseBranch } =
    useLoaderData<typeof loader>();
  let { "*": splat } = useParams();
  if (isLatest) return null;

  return (
    <div className="text-center">
      <div className="p-2 bg-[#0072c3] text-xs text-white">
        <VersionWarningMessage
          branches={branches}
          currentRef={currentRef}
          latestPath={`/docs/${product}/${releaseBranch}`}
          splat={splat}
        />
      </div>
    </div>
  );
}

function NavMenuMobile() {
  let doc = useDoc();
  return (
    <div className="lg:hidden">
      <DetailsMenu className="group relative flex h-full flex-col">
        <summary
          tabIndex={0}
          className="_no-triangle flex cursor-pointer select-none items-center gap-2 border-b border-gray-50 bg-white px-2 py-3 text-sm font-medium hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        >
          <div className="flex items-center gap-2">
            <svg aria-hidden className="h-5 w-5 group-open:hidden">
              <use href={`${iconsHref}#chevron-r`} />
            </svg>
            <svg aria-hidden className="hidden h-5 w-5 group-open:block">
              <use href={`${iconsHref}#chevron-d`} />
            </svg>
          </div>
          <div className="whitespace-nowrap font-bold">
            {doc ? doc.attrs.title : "Navigation"}
          </div>
        </summary>
        <div className="absolute h-[66vh] w-full overflow-auto overscroll-contain border-b bg-white p-2 pt-5 shadow-2xl dark:border-gray-700 dark:bg-gray-900 dark:shadow-black">
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
        "sticky bottom-0 top-16 -ml-3 hidden w-[--nav-width] flex-col gap-3 self-start overflow-auto pb-10 pr-5 pt-5 lg:flex",
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
    <nav>
      <ul>
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
            <li key={category.attrs.title} className="mb-3">
              {menuCategoryType === "link" ? (
                <MenuSummary as="div">
                  <MenuCategoryLink to={category.slug}>
                    {category.attrs.title}
                  </MenuCategoryLink>
                </MenuSummary>
              ) : (
                <MenuCategoryDetails className="group" slug={category.slug}>
                  <MenuSummary>
                    {menuCategoryType === "linkAndDetails" ? (
                      <MenuCategoryLink to={category.slug}>
                        {category.attrs.title}
                      </MenuCategoryLink>
                    ) : (
                      category.attrs.title
                    )}
                    <svg aria-hidden className="h-5 w-5 group-open:hidden">
                      <use href={`${iconsHref}#chevron-r`} />
                    </svg>
                    <svg
                      aria-hidden
                      className="hidden h-5 w-5 group-open:block"
                    >
                      <use href={`${iconsHref}#chevron-d`} />
                    </svg>
                  </MenuSummary>
                  {category.children.map((doc) => {
                    return (
                      <MenuLink key={doc.slug} to={doc.slug}>
                        {doc.attrs.title}{" "}
                        {doc.attrs.tag && (
                          <Badge variant="default" className="!font-normal">
                            {doc.attrs.tag}
                          </Badge>
                        )}
                      </MenuLink>
                    );
                  })}
                </MenuCategoryDetails>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  ) : (
    <div className="bold text-gray-300">Failed to load menu</div>
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
      className={cx(className, "relative flex cursor-pointer flex-col")}
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
    "rounded-2xl px-3 py-3 transition-colors duration-100";
  const wrappedChildren = (
    <div className="flex h-5 w-full items-center justify-between text-base font-semibold leading-[1.125]">
      {children}
    </div>
  );

  if (as === "summary") {
    return (
      <summary
        className={cx(
          sharedClassName,
          "_no-triangle block select-none",
          "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-800  dark:focus-visible:ring-gray-100",
          "hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:active:bg-gray-700"
        )}
      >
        {wrappedChildren}
      </summary>
    );
  }

  return (
    <div
      className={cx(
        sharedClassName,
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-blue-800 dark:has-[:focus-visible]:ring-gray-100"
      )}
    >
      {wrappedChildren}
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
        "outline-none focus-visible:text-blue-brand dark:focus-visible:text-blue-400",
        isActive
          ? "text-blue-brand dark:text-blue-brand"
          : "hover:text-blue-500"
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
      className={cx(
        "group relative my-px flex min-h-[2.25rem] items-center justify-between rounded-md border-transparent px-3 py-2 text-sm",
        "outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-800  dark:focus-visible:ring-gray-100",
        isActive
          ? ["text-black", "bg-accent"]
          : ["text-gray-700 hover:text-black", "hover:bg-accent"]
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
    ? ["Edit on GitHub", `${repoUrl}/edit/${githubRef}/${doc.slug}.md`]
    : ["View on GitHub", `${repoUrl}/blob/${githubRef}/${doc.slug}.md`];

  return (
    <a
      className="flex items-center gap-1 hover:underline"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {text}
      <svg aria-hidden className="h-4 w-4">
        <use href={`${iconsHref}#edit`} />
      </svg>
    </a>
  );
}

function InnerContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-auto px-4 sm:px-6 lg:px-8 xl:max-w-[90rem]">
      {children}
    </div>
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
