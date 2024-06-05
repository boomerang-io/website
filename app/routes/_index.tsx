import type { MetaFunction } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { siteConfig } from "~/config/site";
import { env } from "~/utils/env.server";

export const meta: MetaFunction = () => {
  return [
    { title: siteConfig.name },
    {
      name: "description",
      content: siteConfig.description,
    },
  ];
};

export async function loader() {
  const headers: RequestInit["headers"] = {
    "Content-Type": "application/json",
  };
  if (env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${env.GITHUB_TOKEN}`;
  }
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query: `
        query {
          organization(login: "boomerang-io") {
            repositories(first: 6, orderBy: {field: STARGAZERS, direction: DESC}, isArchived: false) {
              edges {
                node {
                  id
                  name
                  url
                  description
                  stargazerCount
                  forkCount
                }
              }
            }
          }
        }
      `,
    }),
  });

  const data = await response.json();
  if (data.message) {
    console.error(data);
    return json({});
  }
  console.log(data);
  if (data.data.organization.repositories.edges) {
    const repos = data.data.organization.repositories.edges.map(
      (edge: RepoEdge) => edge.node
    );
    return json(repos);
  } else {
    return json({});
  }
}

type RepoNode = {
  id: string;
  name: string;
  url: string;
  description: string;
  stargazerCount: number;
  forkCount: number;
};

type RepoEdge = {
  node: RepoNode;
};

export default function Index() {
  const repos: RepoNode[] = useLoaderData<typeof loader>();

  return (
    <>
      <Header className="" />
      <div className="flex flex-col min-h-[100dvh]">
        <main className="flex-1">
          <section className="bg-[rgb(6,23,39)] h-[calc(100vh-160px)] flex items-center text-white py-12 md:py-20">
            <div className="container mb-24 max-w-[828px]">
              {/* Build with code from https://cruip.com/creating-a-sliding-text-animation-with-tailwind-css/ */}
              <h1 className="text-4xl md:text-6xl font-medium mono mb-7">
                Committed to improving{" "}
                <span className=" text-[#0f62fe] inline-flex flex-col h-[calc(theme(fontSize.4xl)*theme(lineHeight.tight))] md:h-[calc(theme(fontSize.6xl)*theme(lineHeight.tight))] overflow-hidden">
                  <ul className="block animate-text-slide-4 text-left leading-tight [&_li]:block">
                    <li>automation</li>
                    <li>CI/CD</li>
                    <li>policies</li>
                    <li>development</li>
                    <li aria-hidden="true">automation</li>
                  </ul>
                </span>
              </h1>
              <p className="max-w-[640px] text-lg md:text-xl">
                A collection of open-source projects by a group of people who
                love all things automation, CI/CD, and software development.
              </p>
            </div>
          </section>
          <section className="flex items-center">
            <div className="mb-24 w-full delay-step_5 before-enter enter">
              <div className="container h-14 text-center">
                <p className="text-muted-foreground md:text-lg mt-5 mb-5">
                  In collaboration with
                </p>
                <div className="flex items-center justify-center flex-nowrap">
                  <img
                    src="/logo/ibm.svg"
                    alt="IBM logo"
                    className="max-w-[122px] w-1/3 max-h-10"
                  />
                  <img
                    src="/logo/ey.svg"
                    alt="EY logo"
                    className="max-w-[122px] w-1/3 max-h-10"
                  />
                  <img
                    src="/logo/backstop.svg"
                    alt="Backstop logo"
                    className="max-w-[122px] w-1/3 max-h-10"
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="bg-white relative items-center mx-auto px-4 py-6 md:py-8 sm:px-6 space-y-24">
            <div className="mx-auto max-w-6xl flex items-center flex-col gap-8 md:gap-14 justify-between md:flex-row">
              <div className="md:w-1/2 md:mb-0 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Boomerang Flow
                </h2>
                <p className="text-muted-foreground">
                  Scalable cloud-native orchestration tool for workflow
                  automation focused on an exceptual user experience. Providing
                  a lower cost of ownership and increased flexibility than
                  traditional RPA.
                </p>
                <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                  <li>No-code drag-and-drop workflow builder</li>
                  <li>Collaborate in teams - and access shared features </li>
                  <li>
                    Recurring or one-off schedules saving you time and effort to
                    run a task at the time it needs doing.
                  </li>
                  <li>
                    Native human-in-the-loop actions, from waiting for approvals
                    to manual tasks
                  </li>
                </ul>
                <div className="flex gap-4">
                  <Link
                    className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    to="/flow"
                  >
                    Learn More
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    to={siteConfig.github.repoUrl}
                  >
                    View on GitHub
                  </Link>
                  <Link
                    className="min-w-[100px] inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    to="/flow/try"
                  >
                    Try Me
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 max-w-lg">
                <span className="hidden md:block align-top items-center shadow-2xl shadow-primary/25">
                  <img
                    alt="Workflow Editor"
                    className="!m-0 aspect-[1000/562]"
                    src="/boomerang-flow-editor.png"
                    height={562}
                    width={1000}
                  />
                </span>
              </div>
            </div>
            <div className="mx-auto max-w-6xl flex items-center flex-col gap-8 md:gap-14 justify-between md:flex-row-reverse">
              <div className="md:w-1/2 md:mb-0 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Remix Docs Template
                </h2>
                <p className="text-muted-foreground">
                  A Remix starter template for running a markdown documentation
                  site pulling from GitHub.
                </p>
                <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                  <li>Remote fetching of markdown and images from GitHub</li>
                  <li>Version selector</li>
                  <li>Customisable components</li>
                  <li>Configuration</li>
                  <li>Cache support</li>
                </ul>
                <div className="flex gap-4">
                  <Link
                    className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    to={`${siteConfig.github.repoUrl}/remix-docs-template`}
                  >
                    View on GitHub
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 max-w-lg">
                <span className="hidden md:block align-top items-center shadow-2xl shadow-primary/25">
                  <img
                    alt="Workflow Editor"
                    loading="lazy"
                    className="!m-0 aspect-[1000/562]"
                    src="/boomerang-flow-editor.png"
                    height={562}
                    width={1000}
                  />
                </span>
              </div>
            </div>
            <div className="mx-auto max-w-6xl flex items-center flex-col gap-8 md:gap-14 justify-between md:flex-row">
              <div className="md:w-1/2 md:mb-0 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Boomerang Bosun
                </h2>
                <p className="text-muted-foreground">
                  Policy-based gating system that combines policy definitions
                  with rules and metrics data to validate if specific Gates are
                  passed. Bosun provides a UI to interact with and manage your
                  policies and validation activities.
                </p>
                <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                  <li>Leverages Open Policy Agent (OPA) at its core.</li>
                  <li>CI/CD Gates</li>
                  <li>Generic policy validation</li>
                </ul>
                <div className="flex gap-4">
                  <Link
                    className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    to="#"
                  >
                    View on GitHub
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    to="/bosun/docs"
                  >
                    Documentation
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 max-w-lg">
                <span className="hidden md:block align-top items-center shadow-2xl shadow-primary/25">
                  <img
                    alt="Workflow Editor"
                    className="!m-0 aspect-[1000/562]"
                    src="/boomerang-flow-editor.png"
                    height={562}
                    width={1000}
                  />
                </span>
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-8 px-4 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                Featured Repositories
              </h2>
              <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400">
                Explore our collection of GitHub repositories that make up our
                open-source projects.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(repos).length ? (
                repos.map((repo, index) => (
                  <Card
                    key={index}
                    className="flex flex-col min-h-[228px] max-h-[228px] justify-between rounded-md"
                  >
                    <CardHeader className="flex items-center gap-4">
                      {/* <div className="grid gap-1"> */}
                      <CardTitle className="w-full">{repo.name}</CardTitle>
                      <CardDescription
                        className="w-full max-h-[80px] overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {repo.description}
                      </CardDescription>
                      {/* </div> */}
                    </CardHeader>
                    <CardContent className="w-full self-end flex items-center justify-between">
                      <Link
                        className="inline-flex h-9 items-center justify-start rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        to={repo.url}
                      >
                        View on Github
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <img
                            className="w-full m-0"
                            src="/icon/star.svg"
                            alt="stars"
                          />
                          <span className="w-full ml-2">
                            {repo.stargazerCount}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <img
                            className="w-full m-0"
                            src="/icon/fork.svg"
                            alt="forks"
                          />
                          <span className="w-full ml-2">{repo.forkCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <>
                  <Card className="flex flex-col min-h-[228px] max-h-[228px] justify-between rounded-md w-[366px]">
                    <CardHeader className="flex items-start gap-4">
                      <Skeleton className="h-4 rounded-md w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-9 w-[100px]" />
                    </CardHeader>
                  </Card>
                  <Card className="flex flex-col min-h-[228px] max-h-[228px] justify-between rounded-md w-[366px]">
                    <CardHeader className="flex items-start gap-4">
                      <Skeleton className="h-4 rounded-md w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-9 w-[100px]" />
                    </CardHeader>
                  </Card>
                  <Card className="flex flex-col min-h-[228px] max-h-[228px] justify-between rounded-md w-[366px]">
                    <CardHeader className="flex items-start gap-4">
                      <Skeleton className="h-4 rounded-md w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-9 w-[100px]" />
                    </CardHeader>
                  </Card>
                </>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
