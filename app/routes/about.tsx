import { Link } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
  CardContent,
} from "~/components/ui/card";
import { siteConfig } from "~/config/site";
import iconsHref from "~/icons.svg";

export default function About() {
  return (
    <>
      <Header className="" />
      <div className="flex flex-col min-h-[100dvh]">
        <main className="flex-1">
          <section className="w-full pt-12 lg:pt-16">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Get to know us
                  </h1>
                  <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    We’re a group of developers who have a vision, and a
                    passion, to develop great software.
                  </p>
                </div>
              </div>
            </div>
            <div className="container max-w-3xl px-4 md:px-6 pt-16 text-lg">
              <p>
                Automating workflows was a passion we had around making modern
                automation available and easily accessible. Crafting workflows
                should be as easy as composing boxes on a canvas - without
                having to worry about standing up infrastructure or worrying
                about virtual machine based bots.
              </p>
              <br />
              <p>
                In 2018 we created the first version of the workflow automation
                tool and made it open-source as Boomerang Flow. It stemmed from
                work we were doing with continuous integration and felt that it
                could be applied broader than just building and testing code.
              </p>
              <br />
              <p>
                Members of the community have spent time building various CI/CD
                based technologies and an entire IBM internal platform codenamed
                Boomerang CICD. Boomerang Bosun was born from this platform as a
                small project on how to leverage policies as deployment gates.
              </p>
            </div>
          </section>
          <section className="px-4 py-12 md:py-16 lg:py-20">
            <div className="container max-w-3xl px-4 md:px-6 pt-16 text-lg">
              <div className="items-center space-y-3 text-center">
                <h2 className="text-xl font-bold tracking-tighter md:text-4xl/tight">
                  Want to get involved?
                </h2>
              </div>
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 pt-4">
                <Card className="flex flex-col min-h-[248px] justify-between rounded-md">
                  <CardHeader className="flex gap-4">
                    <div className="text-black hover:text-gray-600 md:grid">
                      <img
                        src="/logo/slack.svg"
                        alt="Join us on Slack"
                        className="w-[24px] h-[24px] "
                      />
                    </div>
                    <CardTitle className="w-full">Join us on Slack</CardTitle>
                    <CardDescription
                      className="w-full max-h-[80px] overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      Come join us on Slack to get help or help out, and be
                      right there to participate in what we’re working on as it
                      happens.
                    </CardDescription>
                    {/* </div> */}
                  </CardHeader>
                  <CardContent className="w-full self-end flex items-center justify-between">
                    <Link
                      className="inline-flex h-9 items-center justify-start rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                      to="https://join.slack.com/t/boomerang-io/shared_invite/zt-pxo2yw2o-c3~6YvWkKNrKIwhIBAKhaw"
                    >
                      Join us on Slack
                    </Link>
                  </CardContent>
                </Card>
                <Card className="flex flex-col min-h-[248px] justify-between rounded-md">
                  <CardHeader className="flex gap-4">
                    <div className="text-black hover:text-gray-600 md:grid">
                      <svg
                        aria-hidden
                        style={{ width: `24px`, height: `24px` }}
                      >
                        <use href={`${iconsHref}#github`} />
                      </svg>
                    </div>
                    <CardTitle className="w-full">Join us on GitHub</CardTitle>
                    <CardDescription
                      className="w-full max-h-[80px] overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      Contributing to the community is a great way to particpate
                      and partnering to develop great software for everyone.
                    </CardDescription>
                    {/* </div> */}
                  </CardHeader>
                  <CardContent className="w-full self-end flex items-center justify-between">
                    <Link
                      className="inline-flex h-9 items-center justify-start rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                      to={`${siteConfig.github.repoUrl}` + `/community`}
                    >
                      Join us on GitHub
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
