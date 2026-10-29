export const siteConfig = {
  name: "Boomerang", 
  project: "Boomerang",
  url: "https://useboomerang.io",
  description:
    "A collection of open-source projects for CI/CD and automation",
  github: {
    repoUrl: "https://github.com/boomerang-io",
    flow: "https://github.com/boomerang-io/flow",
    bosun: "https://github.com/boomerang-io/bosun.service.policy",
    docsTemplate: "https://github.com/boomerang-io/remix-docs-template",
  },
  slack: {
    url: "https://join.slack.com/t/boomerang-io/shared_invite/zt-pxo2yw2o-c3~6YvWkKNrKIwhIBAKhaw",
  },
  twitter: {
    handle: "@useboomerang",
    url: "https://twitter.com/useboomerang"
  },
  license: {
    name: "Apache 2.0",
    url: "https://opensource.org/license/apache-2-0",
  }
}

export type SiteConfig = typeof siteConfig
