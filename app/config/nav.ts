import { siteConfig } from "~/config/site";

export type NavItem = {
  title: string;
  href: string;
  // Opens outside the site (GitHub, Slack)
  external?: boolean;
};

interface NavConfig {
  mainNav: NavItem[];
  footerNav: { title: string; items: NavItem[] }[];
}

export const navConfig: NavConfig = {
  mainNav: [
    { title: "Flow", href: "/flow" },
    { title: "Bosun", href: "/docs/bosun" },
    { title: "Docs", href: "/docs" },
    { title: "GitHub", href: siteConfig.github.repoUrl, external: true },
  ],
  footerNav: [
    {
      title: "Projects",
      items: [
        { title: "Flow", href: "/flow" },
        { title: "Bosun", href: "/docs/bosun" },
        { title: "Docs Template", href: siteConfig.github.docsTemplate, external: true },
      ],
    },
    {
      title: "Docs",
      items: [
        { title: "Flow docs", href: "/docs/flow" },
        { title: "Bosun docs", href: "/docs/bosun" },
        { title: "Run locally", href: "/flow#run-locally" },
      ],
    },
    {
      title: "Community",
      items: [
        { title: "GitHub", href: siteConfig.github.repoUrl, external: true },
        { title: "Slack", href: siteConfig.slack.url, external: true },
        { title: "About", href: "/about" },
      ],
    },
  ],
};
