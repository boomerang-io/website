import type { LoaderFunctionArgs } from "react-router";
import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useMatches,
  useRouteError,
} from "react-router";
import "~/styles/globals.css";
import { isProductionHost, removeTrailingSlashes } from "./utils/http.server";
import { canUseDOM } from "./utils/ui-utils";
import { cn } from "./utils/theme";

export function links() {
  return [
    {
      rel: "prefetch",
      as: "image",
      href: "/boomerang-logo-dark.svg",
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/boomerang-icon.png",
    },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  removeTrailingSlashes(request);

  let isDevHost = !isProductionHost(request);
  let url = new URL(request.url);

  return data(
    {
      host: url.host,
      isProductionHost: !isDevHost,
      noIndex: isDevHost,
    },
    {
      headers: {
        Vary: "Cookie",
      },
    }
  );
}

interface LayoutProps {
  title?: string;
  isDev?: boolean;
  noIndex: boolean;
  children: React.ReactNode;
}

function Layout({ children, noIndex }: LayoutProps) {
  let matches = useMatches();
  let isDocsPage = !!matches.find((match) =>
    match.id.startsWith("routes/docs")
  );
  return (
    <html
      lang="en"
      className={cn({
        "scroll-pt-[6rem] lg:scroll-pt-[4rem]": isDocsPage,
      })}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        {noIndex && <meta name="robots" content="noindex" />}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  let { noIndex } = useLoaderData<typeof loader>();
  return (
    <Layout noIndex={noIndex}>
      <Outlet />
    </Layout>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();
  if (!canUseDOM) {
    console.error(error);
  }

  if (isRouteErrorResponse(error)) {
    return (
      <Layout noIndex title={error.statusText}>
        <div className="bg-black flex flex-1 flex-col justify-center text-white h-screen">
          <div className="text-center leading-none">
            <a
              className="inline-block text-[8vw] underline:none"
              href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${error.status}`}
              rel="noreferrer"
              target="_blank"
            >
              <h1 className="font-mono text-[25vw]">{error.status}</h1>
            </a>
          </div>
        </div>
      </Layout>
    );
  }
}
