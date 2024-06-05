import { Link } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import FlowLogo from "~/components/images/FlowLogo";

export default function About() {
  return (
    <main>
      <section className="w-full pt-12 lg:pt-16">
        <div className="container flex flex-col items-center">
          <div className="relative md:flex items-center h-auto justify-between max-w-[110rem] min-h-[50vh] p-10">
            <div className="h-full w-[48%]">
              <div className="flex mb-2">
                <FlowLogo className="mr-2 w-6 h-6" />
                <h1 className="text-muted-foreground text-2xl ">
                  Boomerang Flow
                </h1>
              </div>
              <h2 className="font-semibold text-6xl mb-2">
                Event-driven workflow automation and orchestration tool
              </h2>
              <p className="text-muted-foreground text-base mb-8 max-w-[30rem] w-full">
                A new scalable and extensible modern approach to automation
                focused on the end user experience with lower cost and increased
                productivity. Built for the cloud.
              </p>
              <div className="flex gap-4">
                <Link
                  className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  to="/docs/boomerang-flow/introduction/getting-started"
                >
                  Get Started
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  to="/flow/try"
                >
                  Try Me
                </Link>
                <Link
                  className="min-w-[100px] inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  to="https://costel-moraru.medium.com/lets-put-boomerang-flow-on-our-laptop-8a63eac2b9e5"
                >
                  Run Locally
                </Link>
              </div>
            </div>
            <div className="items-center self-stretch flex relative w-[48%]">
              <div className="pt-[56.25%] relative w-full shadow-2xl shadow-primary/25">
                <iframe
                  allowFullScreen
                  className="absolute top-0 z-[1] h-full w-full max-h-[30rem] border-none"
                  loading="lazy"
                  src="https://www.youtube.com/embed/-lOninwMoz4?start=0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full px-4 py-12 md:py-16 lg:py-20">
        <div className="container space-y-20">
          <div className="text-center">
            <div className="inline-block bg-[rgb(18,189,186)] w-16 h-1 mb-2" />
            <h2 className="text-4xl font-bold mb-4">Strive for automation</h2>
            <p className="text-muted-foreground mb-12">
              Drastically reduce the time spent on low value tasks and focus on
              what matters most.
            </p>
          </div>
          <div className="mx-auto max-w-6xl flex items-center flex-col gap-8 md:gap-14 justify-between md:flex-row-reverse">
            <div className="md:w-1/2 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold">
                A Raw Introduction
              </h2>
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                <li>An introduction to Boomerang Flow</li>
                <li>What is it? And what does it do?</li>
                <li>
                  Execute and check the results of the newly created workflow.
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 max-w-lg">
              <div className="pt-[56.25%] relative w-full shadow-2xl shadow-primary/25">
                <iframe
                  allowFullScreen
                  className="absolute top-0 z-[1] h-full w-full max-h-[30rem] border-none aspect-video"
                  loading="lazy"
                  src="https://www.youtube.com/embed/erBEQdBHFJU?start=0"
                />
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-6xl flex items-center flex-col gap-8 md:gap-14 justify-between md:flex-row">
            <div className="md:w-1/2 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold">Workflows</h2>
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                <li>
                  Drag & drop predefined or custom created Tasks, chain them to
                  build your workflow.
                </li>
                <li>
                  Create workflow parameters to provide dynamic data at runtime.
                </li>
                <li>
                  View and update general information about the workflow, set
                  triggers, and configure options.
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 max-w-lg">
              <span className="hidden md:block align-top items-center shadow-2xl shadow-primary/25">
                <img
                  alt="Workflow Editor"
                  className="!m-0 w-full h-full object-cover"
                  src="/images/hero-designer.png"
                  height={562}
                  width={1000}
                />
              </span>
            </div>
          </div>
          <div className="mx-auto max-w-6xl flex items-center flex-col gap-8 md:gap-14 justify-between md:flex-row-reverse">
            <div className="md:w-1/2 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold">Tasks</h2>
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                <li>
                  An increasing list of no-to-low code prebuilt open-source
                  Tasks.
                </li>
                <li>
                  Fully extensible by supporting prebuilt Tekton® Catalog Task
                  and if that's not enough, build your own Task based on any
                  Docker image.
                </li>
                <li>
                  With an enhanced visual platform to abstract the experience so
                  you don't need to work in YAML directly in Kubernetes.
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 max-w-lg">
              <span className="hidden md:block align-top items-center shadow-2xl shadow-primary/25">
                <img
                  alt="Task Manager"
                  className="!m-0 w-full h-full object-cover"
                  src="/images/hero-taskmanager.png"
                  height={562}
                  width={1000}
                />
              </span>
            </div>
          </div>
          <div className="mx-auto max-w-6xl flex items-center flex-col gap-8 md:gap-14 justify-between md:flex-row">
            <div className="md:w-1/2 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold">Run Activity</h2>
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                <li>
                  Check the execution details of your workflow design with
                  visual indication of both the status of each task, as well as
                  the link state.
                </li>
                <li>
                  The Activity page provides you with a snapshot breakdown with
                  the ability to filter across multiple criterias.
                </li>
                <li>
                  View logs and output properties as well as cancel running
                  Workflows.
                </li>
                <li>Approve or Decline Manual Tasks.</li>
              </ul>
            </div>
            <div className="md:w-1/2 max-w-lg">
              <span className="hidden md:block align-top items-center shadow-2xl shadow-primary/25">
                <img
                  alt="Workflow Run Activity"
                  className="!m-0 w-full h-full object-cover"
                  src="/images/hero-activitydetail.png"
                  height={562}
                  width={1000}
                />
              </span>
            </div>
          </div>
          <div className="mx-auto max-w-6xl flex items-center flex-col gap-8 md:gap-14 justify-between md:flex-row-reverse">
            <div className="md:w-1/2 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold">
                Gain insights into real time metrics
              </h2>
              <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
                <li>Number of executions (total and by workflow)</li>
                <li>Peak execution periods</li>
                <li>Run time durations</li>
                <li>Status percentage breakdown</li>
              </ul>
            </div>
            <div className="md:w-1/2 max-w-lg">
              <span className="hidden md:block align-top items-center shadow-2xl shadow-primary/25">
                <img
                  alt="Workflow Run Activity"
                  className="!m-0 w-full h-full object-cover"
                  src="/images/hero-activitydetail.png"
                  height={562}
                  width={1000}
                />
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
