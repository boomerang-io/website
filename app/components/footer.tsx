import { Link } from "react-router";
import { siteConfig } from "~/config/site";
import { navConfig } from "~/config/nav";

export function Footer() {
  return (
    <footer className="border-t border-brand-line">
      <div className="mx-auto flex max-w-page flex-col gap-10 px-4 pb-10 pt-14 sm:px-8">
        <div className="flex flex-wrap justify-between gap-10">
          <img
            src="/boomerang-logo-dark.svg"
            alt={siteConfig.name}
            className="h-6 w-auto self-start"
          />
          <div className="flex flex-wrap gap-x-[72px] gap-y-8 text-[15px]">
            {navConfig.footerNav.map((group) => (
              <div key={group.title} className="flex flex-col gap-2.5">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-brand-muted">
                  {group.title}
                </p>
                {group.items.map((item) =>
                  item.external ? (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-ink hover:text-brand-link"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="text-brand-ink hover:text-brand-link"
                    >
                      {item.title}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="border-t border-brand-line pt-6 text-[13px] text-brand-muted">
          © {siteConfig.project}. Docs and examples licensed under{" "}
          <a className="hover:underline" href={siteConfig.license.url}>
            {siteConfig.license.name}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
