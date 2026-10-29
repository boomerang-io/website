import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { siteConfig } from "~/config/site";

export const meta: MetaFunction = () => {
  return [
    { title: `Boomerang Flow | ${siteConfig.name}` },
    {
      name: "description",
      content:
        "Event-driven workflow automation. Build, automate and run Workflows without writing a single line of code.",
    },
  ];
};

const screens = [
  {
    title: "Workflow editor",
    description:
      "Where the magic happens. A visual drag-and-drop editor for your Tasks, switches, Parameters and triggers.",
    src: "/images/hero-designer.png",
    width: 3352,
    height: 1430,
  },
  {
    title: "Task manager",
    description:
      "Bring a script, bring a container, or write your own Task from scratch. Or start with the prebuilt Tasks and the Tekton catalog.",
    src: "/images/hero-taskmanager.png",
    width: 3358,
    height: 1590,
  },
  {
    title: "Actions",
    description:
      "Approve or decline the approvals and manual tasks waiting on your Team.",
    src: "/images/hero-actions.png",
    width: 3358,
    height: 1472,
  },
  {
    title: "Run detail",
    description:
      "View each run in detail, with logs, outputs and step-by-step progress for easy troubleshooting.",
    src: "/images/hero-activitydetail.png",
    width: 3360,
    height: 1304,
  },
];

const steps = [
  {
    title: "Build.",
    description:
      "Drag, drop and connect Tasks, then add Parameters that resolve at runtime.",
  },
  {
    title: "Trigger.",
    description:
      "Start Workflows manually, on a schedule, via webhook or from an event.",
  },
  {
    title: "Approve.",
    description:
      "Human-in-the-loop approvals and manual tasks hold the run until someone acts.",
  },
  {
    title: "Run and view.",
    description:
      "Runs are queued and reliably executed. Track every one in Activity and Insights.",
  },
];

const headingClassName =
  "text-[32px] font-semibold leading-[1.1] tracking-[-0.015em] md:text-[40px]";

export default function FlowPage() {
  return (
    <main>
      <section className="border-b border-brand-line">
        <div className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(min(480px,100%),1fr))] items-end gap-x-16 gap-y-8 px-4 pb-20 pt-[88px] sm:px-8">
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-brand-muted">
              Boomerang Flow
            </p>
            <h1 className="text-[40px] font-semibold leading-[1.04] tracking-[-0.02em] [text-wrap:balance] md:text-[60px]">
              Event-driven workflow automation.
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-lg text-brand-muted [text-wrap:pretty] md:text-[19px]">
              The easiest way to build, automate and run Workflows, without
              writing a single line of code... unless you really want to! Built
              for the cloud and fully extensible.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/docs/flow">Read the docs</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#run-locally">Run it locally</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="inside-flow"
        className="mx-auto flex max-w-page flex-col gap-10 px-4 pb-[104px] pt-24 sm:px-8"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] items-end gap-x-16 gap-y-4">
          <h2 className={headingClassName}>Inside Flow</h2>
          <p className="text-brand-muted">
            Everything you need to build, run and manage your Workflows, whether
            you’re a solo operator or a whole Team.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(520px,100%),1fr))] gap-x-8 gap-y-10">
          {screens.map((screen) => (
            <figure key={screen.title} className="m-0 flex flex-col gap-3.5">
              <div className="aspect-video overflow-hidden rounded-card border border-brand-edge bg-white">
                <img
                  src={screen.src}
                  alt={`The ${screen.title.toLowerCase()}`}
                  width={screen.width}
                  height={screen.height}
                  loading="lazy"
                  className="h-full w-full object-cover object-left-top"
                />
              </div>
              <figcaption className="flex flex-col gap-0.5">
                <strong className="font-semibold">{screen.title}</strong>
                <span className="text-[15px] text-brand-muted">{screen.description}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-dots border-y border-brand-line">
        <div className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] items-center gap-14 px-4 py-24 sm:px-8">
          <div className="flex flex-col gap-7">
            <h2 className={headingClassName}>From trigger to approval.</h2>
            <ol className="flex flex-col border-t border-brand-edge">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[48px_1fr] gap-4 border-b border-brand-edge py-5"
                >
                  <span className="font-mono text-[13px] font-medium text-brand-teal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <strong className="font-semibold">{step.title}</strong>{" "}
                    <span className="text-brand-muted">{step.description}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <figure className="m-0 overflow-hidden rounded-card border border-brand-edge bg-white shadow-[0_18px_40px_rgba(11,27,43,0.10)]">
            <figcaption className="border-b border-brand-line px-4 py-3 font-mono text-xs text-brand-muted">
              flow / schedules
            </figcaption>
            <img
              src="/images/hero-schedules.png"
              alt="The Flow schedules page with a calendar of upcoming runs"
              width={3324}
              height={1474}
              loading="lazy"
              className="block h-auto w-full"
            />
          </figure>
        </div>
      </section>

      <section id="run-locally" className="scroll-mt-16 bg-brand-ink text-white">
        <div className="mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] items-center gap-x-16 gap-y-12 px-4 py-24 sm:px-8">
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-brand-sky">
              Run it locally
            </p>
            <h2 className={headingClassName}>The whole stack, one command.</h2>
            <p className="text-brand-mist [text-wrap:pretty]">
              Up and running in no time. Docker Compose builds Flow from source
              and starts it alongside MongoDB, a local sign-in provider and an
              S3-compatible artifact store. Head to localhost:3000 and sign in;
              the first person in becomes the admin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/docs/flow">Read the docs</Link>
              </Button>
              <Button asChild size="lg" variant="inverse">
                <a href={siteConfig.github.flow}>View on GitHub</a>
              </Button>
            </div>
          </div>
          <figure className="m-0 flex min-w-0 flex-col gap-3">
            <div className="overflow-hidden rounded-card border border-white/15 bg-[#06111C]">
              <p className="border-b border-white/10 px-4 py-3 font-mono text-xs text-[#9AACBE]">
                terminal
              </p>
              <pre className="overflow-x-auto px-5 py-6 font-mono text-[15px] leading-[1.9] text-[#E6EDF3]">
                <code>
                  <span className="text-[#8FA2B5]">$</span> git clone {siteConfig.github.flow}
                  {"\n"}
                  <span className="text-[#8FA2B5]">$</span> cd flow
                  {"\n"}
                  <span className="text-[#8FA2B5]">$</span> docker compose --profile stack up -d --build
                  {"\n"}
                  <span className="text-[#8FA2B5]"># then open http://localhost:3000</span>
                </code>
              </pre>
            </div>
            <figcaption className="text-[15px]">
              <Link to="/docs/flow" className="font-medium text-brand-sky hover:text-white">
                Local setup guide →
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}
