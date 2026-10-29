/*
 * The home page hero: triggers on the left feed Boomerang Flow, which runs each Task through one
 * of the dispatchers on the right. Built from placed elements (no SVG). From the large breakpoint
 * it is three columns joined by brackets; below that it stacks top to bottom.
 *
 * The brackets joining each column are a border on a flex box whose child is pulled out by half a
 * row on each side, so the line runs from the middle of the first row to the middle of the last.
 */

const triggers = ["Manual", "Schedule", "Webhook", "Event", "GitHub"];

const features = [
  "Workflows",
  "Tasks",
  "Parameters",
  "Approvals",
  "Manual Tasks",
  "Activity",
  "Insights",
  "Workspaces",
  "Quotas",
  "Audit",
];

const dispatchers = [
  { name: "Tekton" },
  { name: "Kubernetes Jobs" },
  { name: "Azure Container Apps" },
  { name: "Bring your own", byo: true },
];

const labelClassName = "font-mono text-xs tracking-[0.12em] text-brand-muted";
const rowClassName =
  "flex h-12 flex-1 items-center rounded-card border border-brand-edge bg-white px-4 font-medium";
const byoClassName = "border-dashed border-[#8C9BAB]";

function Line({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`bg-brand-teal ${className}`} />;
}

function Beta() {
  return (
    <span className="font-mono text-[11px] font-normal text-brand-muted">beta</span>
  );
}

function FlowBox() {
  return (
    <div className="flex flex-col gap-3.5 rounded-card bg-brand-ink p-6 text-white shadow-[0_18px_40px_rgba(11,27,43,0.22)]">
      <span className="font-mono text-xs tracking-[0.12em] text-brand-sky">
        BOOMERANG FLOW
      </span>
      <ul className="grid grid-cols-2 gap-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="rounded-md border border-white/20 px-3 py-[9px] text-center text-sm"
          >
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ColumnsDiagram() {
  return (
    <div className="mx-auto grid grid-cols-[minmax(170px,220px)_minmax(40px,64px)_minmax(330px,390px)_minmax(40px,64px)_minmax(210px,290px)] grid-rows-[auto_auto] items-center justify-center gap-y-4 py-2">
      <span className={labelClassName}>TRIGGERS</span>
      <span aria-hidden="true" />
      <span className={`${labelClassName} justify-self-center`}>FLOW ORCHESTRATES</span>
      <span aria-hidden="true" />
      <span className={`${labelClassName} pl-[26px]`}>DISPATCHES TO</span>

      <div className="my-6 flex border-r-2 border-brand-teal">
        <ul className="-my-6 flex w-full flex-col gap-2.5">
          {triggers.map((trigger) => (
            <li key={trigger} className="flex items-center">
              <span className={`${rowClassName} justify-between`}>
                {trigger}
                {trigger === "GitHub" && <Beta />}
              </span>
              <Line className="h-0.5 w-6" />
            </li>
          ))}
        </ul>
      </div>

      <Line className="h-0.5" />
      <FlowBox />
      <Line className="h-0.5" />

      <div className="my-6 flex border-l-2 border-brand-teal">
        <ul className="-my-6 flex w-full flex-col gap-2.5">
          {dispatchers.map(({ name, byo }) => (
            <li key={name} className="flex items-center">
              <Line className="h-0.5 w-6" />
              <span className={byo ? `${rowClassName} ${byoClassName}` : rowClassName}>
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StackedDiagram() {
  return (
    <div className="mx-auto flex w-full max-w-[440px] flex-col items-stretch">
      <span className={`${labelClassName} text-center`}>TRIGGERS</span>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {triggers.map((trigger) => (
          <li
            key={trigger}
            className="flex h-10 items-center gap-2 rounded-card border border-brand-edge bg-white px-3.5 font-medium"
          >
            {trigger}
            {trigger === "GitHub" && <Beta />}
          </li>
        ))}
      </ul>
      <Line className="mx-auto h-8 w-0.5" />
      <span className={`${labelClassName} mb-3 text-center`}>FLOW ORCHESTRATES</span>
      <FlowBox />
      <Line className="mx-auto h-8 w-0.5" />
      <span className={`${labelClassName} text-center`}>DISPATCHES TO</span>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {dispatchers.map(({ name, byo }) => (
          <li
            key={name}
            className={`flex min-h-12 items-center rounded-card border bg-white px-3.5 py-2 font-medium leading-tight ${
              byo ? byoClassName : "border-brand-edge"
            }`}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FlowDiagram() {
  return (
    <figure className="m-0 flex w-full flex-col items-center gap-6">
      <div className="hidden w-full lg:block">
        <ColumnsDiagram />
      </div>
      <div className="w-full lg:hidden">
        <StackedDiagram />
      </div>
      <figcaption className="max-w-[760px] text-center text-[15px] text-brand-muted [text-wrap:pretty]">
        Start a Workflow manually, on a schedule, via webhook or from an event.
        Each Task runs through a dispatcher on your infrastructure, with
        approvals and manual tasks wherever you need a person.
      </figcaption>
    </figure>
  );
}
