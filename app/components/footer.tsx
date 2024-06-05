import * as React from "react";
import { siteConfig } from "~/config/site";

export function Footer() {
  return (
    <footer className="flex place-content-center sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <div className="text-xs text-gray-500 sm:flex sm:items-center sm:gap-2 lg:gap-4">
        <div>
          &copy; 2024{" "}
          <a className="hover:underline" href={siteConfig.url}>
            {siteConfig.project}
          </a>
          . All rights reserved.
        </div>
        <div className="hidden sm:block">•</div>
        <div>
          Docs and examples licensed under{" "}
          <a className="hover:underline" href={siteConfig.license.url}>
            {siteConfig.license.name}
          </a>
        </div>
        <div className="hidden sm:block">•</div>
        <div>
          A collection of open source projects for automation, CI/CD, and
          software development.
        </div>
      </div>
    </footer>
  );
}
