type MainNavItem = {
  title: string,
  href: string,
}

interface NavConfig {
  mainNav: MainNavItem[]
}

export const navConfig: NavConfig = {
  mainNav: [
    {
      title: "Flow",
      href: "/flow",
    },
    {
      title: "Docs",
      href: "/docs",
    },
  ],
}
