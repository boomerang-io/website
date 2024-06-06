type MainNavItem = {
  title: string,
  href: string,
  description?: string,
  children? : MainNavItem[]
}

interface NavConfig {
  mainNav: MainNavItem[]
}

export const navConfig: NavConfig = {
  mainNav: [
    {
      title: "Boomerang Flow",
      href: "/flow",
      children: [
        {
          title: "Overview",
          description: "Find out more about what it is and how it can help you.",
          href: "/flow",
        },
        {
          title: "Try Me",
          description: "Try out Boomerang Flow for yourself. Sponsored by Backstop.",
          href: "/flow/try",
        },
        {
          title: "Documentation",
          description: "Dive deep and learn everything there is to know about Boomerang Flow.",
          href: "/docs",
        },
      ],
    },
    {
      title: "About",
      href: "/about",
    },
  ],
}
