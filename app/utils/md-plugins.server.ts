/*
 * Remark plugins for the docs' markdown extensions. Both work on the mdast tree before it becomes
 * HTML and render through `data.hName`/`data.hProperties`, so no extra dependencies.
 */

// The few mdast shapes these plugins touch.
type Node = {
  type: string;
  value?: string;
  depth?: number;
  children?: Node[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
};

function walk(node: Node, visit: (node: Node) => void) {
  visit(node);
  node.children?.forEach((child) => walk(child, visit));
}

const ALERT_TITLES: Record<string, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

const ALERT_MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

/**
 * GitHub-style alerts: a blockquote starting `[!NOTE]` (or TIP, IMPORTANT, WARNING, CAUTION)
 * becomes `<div class="md-alert md-alert-note">` with a title paragraph.
 */
export function remarkAlerts() {
  return (tree: Node) => {
    walk(tree, (node) => {
      if (node.type !== "blockquote") return;
      let paragraph = node.children?.[0];
      let text = paragraph?.type === "paragraph" ? paragraph.children?.[0] : undefined;
      let match = text?.type === "text" ? ALERT_MARKER.exec(text.value ?? "") : null;
      if (!paragraph || !text || !match) return;

      let type = match[1].toLowerCase();
      text.value = text.value!.slice(match[0].length);
      if (!text.value) paragraph.children!.shift();
      if (paragraph.children![0]?.type === "break") paragraph.children!.shift();
      if (paragraph.children!.length === 0) node.children!.shift();

      node.data = {
        hName: "div",
        hProperties: { className: ["md-alert", `md-alert-${type}`] },
      };
      node.children!.unshift({
        type: "paragraph",
        data: { hProperties: { className: ["md-alert-title"] } },
        children: [{ type: "text", value: ALERT_TITLES[type] }],
      });
    });
  };
}

const TABS_START = /^<!--\s*tabs\s*-->$/i;
const TABS_END = /^<!--\s*\/tabs\s*-->$/i;

function isMarker(node: Node, marker: RegExp) {
  return node.type === "html" && marker.test((node.value ?? "").trim());
}

/**
 * Tabs: everything between `<!-- tabs -->` and `<!-- /tabs -->` is split on its first heading
 * level, each heading becoming a tab. On GitHub the comments are invisible and the headings read
 * as plain sections. The page wires the buttons up (useMarkdownTabs); before hydration the first
 * panel shows.
 */
export function remarkTabs() {
  let count = 0;
  return (tree: Node) => {
    if (!tree.children) return;
    let children: Node[] = [];
    for (let i = 0; i < tree.children.length; i++) {
      let node = tree.children[i];
      let end = isMarker(node, TABS_START)
        ? tree.children.findIndex((n, j) => j > i && isMarker(n, TABS_END))
        : -1;
      if (end === -1) {
        children.push(node);
        continue;
      }
      children.push(...tabsFrom(tree.children.slice(i + 1, end), count++));
      i = end;
    }
    tree.children = children;
  };
}

function tabsFrom(nodes: Node[], group: number): Node[] {
  let depth = nodes.find((node) => node.type === "heading")?.depth;
  if (depth === undefined) return nodes;

  let before: Node[] = [];
  let tabs: { label: Node[]; content: Node[] }[] = [];
  for (let node of nodes) {
    if (node.type === "heading" && node.depth === depth) {
      tabs.push({ label: node.children ?? [], content: [] });
    } else if (tabs.length > 0) {
      tabs[tabs.length - 1].content.push(node);
    } else {
      before.push(node);
    }
  }

  let id = (kind: string, index: number) => `tabs-${group}-${kind}-${index}`;
  return [
    ...before,
    {
      type: "tabs",
      data: { hName: "div", hProperties: { className: ["md-tabs"], dataMdTabs: "" } },
      children: [
        {
          type: "tabList",
          data: { hName: "div", hProperties: { className: ["md-tablist"], role: "tablist" } },
          children: tabs.map(({ label }, index) => ({
            type: "tab",
            data: {
              hName: "button",
              hProperties: {
                type: "button",
                role: "tab",
                id: id("tab", index),
                ariaControls: id("panel", index),
                ariaSelected: index === 0 ? "true" : "false",
                tabIndex: index === 0 ? 0 : -1,
                dataTab: String(index),
              },
            },
            children: label,
          })),
        },
        ...tabs.map(({ content }, index) => ({
          type: "tabPanel",
          data: {
            hName: "div",
            hProperties: {
              className: ["md-tabpanel"],
              role: "tabpanel",
              id: id("panel", index),
              ariaLabelledBy: id("tab", index),
              dataPanel: String(index),
              hidden: index !== 0,
            },
          },
          children: content,
        })),
      ],
    },
  ];
}
