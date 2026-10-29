/*
 * The home page hero: triggers on the left feed Boomerang Flow, which runs each Task through one
 * of the dispatchers on the right. Built from placed elements (no SVG); below the large breakpoint
 * it scrolls sideways in its own box.
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

const rowClassName =
  "flex h-12 flex-1 items-center rounded-card border border-brand-edge bg-white px-4 font-medium";

function Line({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`h-0.5 bg-brand-teal ${className}`} />;
}

export function FlowDiagram() {
  return (
    <figure className="m-0 flex w-full flex-col items-center gap-6">
      <div className="w-full overflow-x-auto">
        <div className="mx-auto grid min-w-[1050px] grid-cols-[220px_64px_390px_64px_290px] grid-rows-[auto_auto] items-center justify-center gap-y-4 py-2">
          <span className="font-mono text-xs tracking-[0.12em] text-brand-muted">
            TRIGGERS
          </span>
          <span aria-hidden="true" />
          <span className="justify-self-center font-mono text-xs tracking-[0.12em] text-brand-muted">
            FLOW ORCHESTRATES
          </span>
          <span aria-hidden="true" />
          <span className="pl-[26px] font-mono text-xs tracking-[0.12em] text-brand-muted">
            DISPATCHES TO
          </span>

          <div className="my-6 flex border-r-2 border-brand-teal">
            <ul className="-my-6 flex w-full flex-col gap-2.5">
              {triggers.map((trigger) => (
                <li key={trigger} className="flex items-center">
                  <span className={`${rowClassName} justify-between`}>
                    {trigger}
                    {trigger === "GitHub" && (
                      <span className="font-mono text-[11px] font-normal text-brand-muted">
                        beta
                      </span>
                    )}
                  </span>
                  <Line className="w-6" />
                </li>
              ))}
            </ul>
          </div>

          <Line />

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

          <Line />

          <div className="my-6 flex border-l-2 border-brand-teal">
            <ul className="-my-6 flex w-full flex-col gap-2.5">
              {dispatchers.map(({ name, byo }) => (
                <li key={name} className="flex items-center">
                  <Line className="w-6" />
                  <span
                    className={
                      byo
                        ? `${rowClassName} border-dashed border-[#8C9BAB]`
                        : rowClassName
                    }
                  >
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <figcaption className="max-w-[760px] text-center text-[15px] text-brand-muted [text-wrap:pretty]">
        Start a Workflow manually, on a schedule, via webhook or from an event.
        Each Task runs through a dispatcher on your infrastructure, with
        approvals and manual tasks wherever you need a person.
      </figcaption>
    </figure>
  );
}
