import { Link } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function About() {
  return (
    <main className="flex-1 py-12 md:py-24 lg:py-32">
      <section className="container px-4 md:px-6 space-y-10 xl:space-y-16">
        <div className="flex flex-col items-center space-y-8 md:space-y-12">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              to="https://backstop.dev"
              className="inline-flex items-center gap-2"
            >
              <img
                src="https://www.backstop.dev/backstop-logo.svg"
                alt="Backstop Logo"
                height={40}
                className="h-8 md:h-10 object-contain"
              />
              <span className="text-sm md:text-base font-medium text-muted-foreground hover:text-gray-900">
                Sponsored by Backstop
              </span>
            </Link>
          </div>
          <div className="space-y-4 md:space-y-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Try it out and automate for free
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              Experience the power of automation in no time. Follow these simple
              steps to get up and running.
            </p>
          </div>
        </div>
      </section>
      <section className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <Card className="flex flex-col min-h-[248px] justify-between rounded-md">
            <CardHeader>
              <CardTitle>Step 1</CardTitle>
              <CardDescription>
                Create your free account and team on Backstop.dev
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                It&apos;s free to get started. You can also reach out for
                greater benefits for open source projects and startups.
              </p>
            </CardContent>
            <CardFooter className="w-full self-end flex items-center justify-between">
              <Link
                to="https://backstop.dev/signup"
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              >
                Sign Up
              </Link>
            </CardFooter>
          </Card>
          <Card className="flex flex-col min-h-[248px] justify-between rounded-md">
            <CardHeader>
              <CardTitle>Step 2</CardTitle>
              <CardDescription>
                Explore our features and customize your experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Start automating your workflows and see the magic happen.
              </p>
            </CardContent>
            <CardFooter className="w-full self-end flex items-center justify-between">
              <Link
                to="https://backstop.dev/docs"
                className="min-w-[100px] inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              >
                Documentation
              </Link>
            </CardFooter>
          </Card>
          <Card className="flex flex-col min-h-[248px] justify-between rounded-md">
            <CardHeader>
              <CardTitle>Step 3</CardTitle>
              <CardDescription>
                Share your experience and leave a review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Let us know what you think about our product. Your feedback
                helps us improve.
              </p>
            </CardContent>
            <CardFooter className="w-full self-end flex items-center justify-between">
              <Link
                to="https://backstop.dev/docs"
                className="min-w-[100px] inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              >
                Contact us
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
      <section className="container px-4 md:px-6 pt-12 md:pt-16 lg:pt-20">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              to="https://backstop.dev"
              className="inline-flex items-center gap-2"
            >
              <img
                src="https://www.backstop.dev/backstop-logo.svg"
                alt="Backstop Logo"
                height={40}
                className="h-8 md:h-10 object-contain"
              />
              <span className="text-sm md:text-base font-medium text-muted-foreground hover:text-gray-900">
                Sponsored by Backstop
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
