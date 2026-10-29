import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { FlowDiagram } from "~/components/flow-diagram";
import { Button } from "~/components/ui/button";
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

const eyebrowClassName =
  "font-mono text-xs uppercase tracking-[0.12em]";

export default function Index() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-dots border-b border-brand-line">
          <div className="mx-auto flex max-w-page flex-col items-center gap-14 px-4 pb-[72px] pt-[88px] sm:px-8">
            <div className="flex max-w-[880px] flex-col items-center gap-6 text-center">
              <p className={`${eyebrowClassName} text-[13px] text-brand-muted`}>
                Boomerang Flow · Open source · Apache 2.0
              </p>
              <h1 className="text-[40px] font-semibold leading-[1.04] tracking-[-0.02em] [text-wrap:balance] md:text-[60px]">
                Orchestrate the work. Run it where you choose.
              </h1>
              <p className="max-w-[680px] text-lg text-brand-muted [text-wrap:pretty] md:text-[19px]">
                Build Workflows with no-code drag-and-drop, then run every Task
                on Tekton, Kubernetes Jobs, Azure Container Apps, or bring your
                own dispatcher.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/flow">Explore Flow</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/flow#run-locally">Run it locally</Link>
                </Button>
              </div>
            </div>
            <FlowDiagram />
          </div>
        </section>

        <section aria-label="Collaborators" className="border-b border-brand-line">
          <div className="mx-auto flex max-w-page flex-wrap items-center justify-center gap-x-12 gap-y-5 p-8">
            <p className={`${eyebrowClassName} text-brand-muted`}>
              In collaboration with
            </p>
            <img src="/logo/ibm.svg" alt="IBM" className="h-[30px] w-auto" />
            <img src="/logo/ey.svg" alt="EY" className="h-[34px] w-auto" />
            <a
              href="https://cheer.dev"
              className="inline-flex items-center gap-2.5 text-xl font-semibold tracking-[-0.01em] text-brand-ink"
            >
              <img src="/logo/cheer-mark.svg" alt="" className="h-[30px] w-[30px]" />
              cheer.dev
            </a>
          </div>
        </section>

        <section
          id="projects"
          className="mx-auto flex max-w-page flex-col gap-8 px-4 py-[104px] sm:px-8"
        >
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.015em] md:text-[40px]">
            Pick up one project, or all three.
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(560px,100%),1fr))] gap-5">
            <article className="flex flex-col overflow-hidden rounded-card bg-brand-ink text-white">
              <div className="flex flex-col gap-3.5 px-9 pb-7 pt-9">
                <p className={`${eyebrowClassName} text-brand-sky`}>Boomerang Flow</p>
                <h3 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.015em]">
                  Event-driven workflow automation and orchestration.
                </h3>
                <p className="text-brand-mist">
                  Drag, drop and connect Tasks to build your Workflows. Bring a
                  script, bring a container, or write your own Task from scratch,
                  then run it on the dispatcher that suits your infrastructure.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 font-medium text-brand-sky">
                  <Link to="/flow" className="hover:text-white">Explore Flow →</Link>
                  <Link to="/docs/flow" className="hover:text-white">Docs →</Link>
                  <a href={siteConfig.github.flow} className="hover:text-white">GitHub →</a>
                </div>
              </div>
              <img
                src="/images/hero-designer.png"
                alt="The Flow workflow editor"
                width={3352}
                height={1430}
                className="ml-9 mt-auto h-60 w-[calc(100%-36px)] rounded-tl-md object-cover object-left-top"
              />
            </article>
            <div className="grid grid-rows-2 gap-5">
              <ProjectCard
                eyebrow="Boomerang Bosun"
                title="Policy as code for your CI/CD gates."
                description="Combine policy definitions with rules and metrics data to validate whether a Gate passes. Open Policy Agent (OPA) at its core."
                docs="/docs/bosun"
                github={siteConfig.github.bosun}
              />
              <ProjectCard
                eyebrow="Remix Docs Template"
                title="Your docs, straight from GitHub."
                description="A React Router starter for running a markdown documentation site pulled from GitHub, with product and version switchers. This site runs on it."
                github={siteConfig.github.docsTemplate}
              />
            </div>
          </div>
        </section>

        <section id="community" className="bg-brand-ink text-white">
          <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-8 px-4 py-[88px] sm:px-8">
            <div className="flex max-w-[620px] flex-col gap-3">
              <h2 className="text-[36px] font-semibold leading-[1.15] tracking-[-0.015em]">
                Built in the open.
              </h2>
              <p className="text-brand-mist">
                We’re a group of people who love all things automation, CI/CD and
                software development. Come say hi on Slack, read the docs, or
                pick up an issue on GitHub.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={siteConfig.slack.url}>Join Slack</a>
              </Button>
              <Button asChild size="lg" variant="inverse">
                <Link to="/docs">Read the docs</Link>
              </Button>
              <Button asChild size="lg" variant="inverse">
                <a href={siteConfig.github.repoUrl}>GitHub</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ProjectCard({
  eyebrow,
  title,
  description,
  docs,
  github,
}: {
  eyebrow: string;
  title: string;
  description: string;
  docs?: string;
  github: string;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-card bg-brand-canvas p-8">
      <p className={`${eyebrowClassName} text-brand-muted`}>{eyebrow}</p>
      <h3 className="text-2xl font-semibold leading-[1.2] tracking-[-0.01em]">{title}</h3>
      <p className="text-brand-muted">{description}</p>
      <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 font-medium text-brand-link">
        {docs && <Link to={docs} className="hover:underline">Docs →</Link>}
        <a href={github} className="hover:underline">GitHub →</a>
      </div>
    </article>
  );
}
