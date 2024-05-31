import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Header } from "~/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { siteConfig } from "~/config/site";

export const meta: MetaFunction = () => {
  return [
    { title: siteConfig.name },
    {
      name: "description",
      content: siteConfig.description,
    },
  ];
};

export default function Index() {
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
                love all things automation, CI/CD, and general software
                development.
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
                    href="#"
                  >
                    Learn More
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    href="#"
                  >
                    View on GitHub
                  </Link>
                  <Link
                    className="min-w-[100px] inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    href="#"
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
                    href="#"
                  >
                    Learn More
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    href="#"
                  >
                    View on GitHub
                  </Link>
                  <Link
                    className="min-w-[100px] inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    href="#"
                  >
                    Try Me
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
                    href="#"
                  >
                    Learn More
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    href="#"
                  >
                    View on GitHub
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
                Explore our collection of cloud-native projects for CI/CD and
                automation.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex items-center gap-4">
                  <div className="grid gap-1">
                    <CardTitle>Boomerang</CardTitle>
                    <CardDescription>
                      A cloud-native CI/CD platform for building, testing, and
                      deploying applications.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Link
                    className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    href="#"
                  >
                    Learn More
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>1.2K</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex items-center gap-4">
                  <div className="grid gap-1">
                    <CardTitle>Boomerang Scheduler</CardTitle>
                    <CardDescription>
                      A scalable and reliable scheduler for running periodic
                      tasks in the cloud.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Link
                    className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    href="#"
                  >
                    Learn More
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>800</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex items-center gap-4">
                  <div className="grid gap-1">
                    <CardTitle>Boomerang Runner</CardTitle>
                    <CardDescription>
                      A lightweight and scalable runner for executing tasks in
                      the cloud.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Link
                    className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    href="#"
                  >
                    Learn More
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>600</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <footer className="flex place-content-center sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <div>
              &copy; 2024{" "}
              <a className="hover:underline" href={siteConfig.url}>
                {siteConfig.project}
              </a>
              . All rights reserved.
            </div>
          </p>
        </footer>
      </div>
    </>
  );
}

function BarChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function CogIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M12 2v2" />
      <path d="M12 22v-2" />
      <path d="m17 20.66-1-1.73" />
      <path d="M11 10.27 7 3.34" />
      <path d="m20.66 17-1.73-1" />
      <path d="m3.34 7 1.73 1" />
      <path d="M14 12h8" />
      <path d="M2 12h2" />
      <path d="m20.66 7-1.73 1" />
      <path d="m3.34 17 1.73-1" />
      <path d="m17 3.34-1 1.73" />
      <path d="m11 13.73-4 6.93" />
    </svg>
  );
}

function LightbulbIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function RocketIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function ServerIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}

function ShieldCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
