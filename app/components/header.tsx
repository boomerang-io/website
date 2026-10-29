import * as React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { siteConfig } from "~/config/site";
import { navConfig, type NavItem } from "~/config/nav";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectLabel,
  SelectSeparator,
  SelectGroup,
  Select,
} from "~/components/ui/select";
import { cn } from "~/utils/theme";

type HeaderProps = {
  className?: string;
  versionData?: {
    versions: string[];
    branches: string[];
    currentRef: string;
    product: string;
    products: { key: string; title: string }[];
  };
};

const selectTriggerClassName =
  "w-28 sm:w-40 border-none shadow-none rounded-md h-10 py-2 font-medium bg-accent focus:outline-none";

export function Header({ className, versionData }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-brand-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" aria-label={`${siteConfig.name} home`} className="shrink-0">
            <img
              src="/boomerang-logo-dark.svg"
              alt={siteConfig.name}
              className="h-7 w-auto"
            />
          </Link>
          {versionData && <DocsSwitchers {...versionData} />}
        </div>
        <MainNav />
        <MobileNav />
      </div>
    </header>
  );
}

function DocsSwitchers({
  versions,
  branches,
  currentRef,
  product,
  products,
}: NonNullable<HeaderProps["versionData"]>) {
  let navigate = useNavigate();
  return (
    <nav aria-label="Documentation" className="flex items-center gap-2 text-sm">
      {products.length > 1 && (
        <Select
          key={product}
          onValueChange={(p) => navigate(`/docs/${p}`)}
          defaultValue={product}
        >
          {/* Phones switch products from the menu (Flow, Bosun) */}
          <SelectTrigger id="product" className={cn(selectTriggerClassName, "hidden sm:flex")}>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-56 r-md">
            {products.map(({ key, title }) => (
              <SelectItem key={key} value={key}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Select
        key={`${product}/${currentRef}`}
        onValueChange={(v) => navigate(`/docs/${product}/` + v)}
        defaultValue={currentRef}
      >
        <SelectTrigger id="version" className={selectTriggerClassName}>
          <SelectValue placeholder="Select a version" />
        </SelectTrigger>
        <SelectContent position="popper" className="w-56 r-md">
          <SelectGroup>
            {branches.length > 0 && (
              <SelectLabel className="text-sm text-muted-foreground font-light">
                Branches
              </SelectLabel>
            )}
            <SelectSeparator />
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            {versions.length > 0 && (
              <SelectLabel className="text-sm text-muted-foreground font-light">
                Versions
              </SelectLabel>
            )}
            <SelectSeparator />
            {versions.map((version) => (
              <SelectItem key={version} value={version}>
                {version}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </nav>
  );
}

function NavItemLink({ item, className }: { item: NavItem; className?: string }) {
  if (item.external) {
    return (
      <a href={item.href} className={className} target="_blank" rel="noreferrer">
        {item.title}
      </a>
    );
  }
  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          className,
          isActive &&
            "underline decoration-brand-teal decoration-2 underline-offset-8"
        )
      }
    >
      {item.title}
    </NavLink>
  );
}

function MainNav() {
  return (
    <nav
      aria-label="Main"
      className="hidden items-center gap-7 text-[15px] font-medium md:flex"
    >
      {navConfig.mainNav.map((item) => (
        <NavItemLink
          key={item.href}
          item={item}
          className="text-brand-ink hover:text-brand-link"
        />
      ))}
      <Button asChild>
        <Link to="/docs">Read the docs</Link>
      </Button>
    </nav>
  );
}

function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="px-2 md:hidden">
          <HamburgerMenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
          <img
            src="/boomerang-logo-dark.svg"
            alt={siteConfig.name}
            className="h-6 w-auto"
          />
        </Link>
        <nav aria-label="Main" className="mt-8 flex flex-col gap-4 text-base font-medium">
          {navConfig.mainNav.map((item) => (
            <NavItemLink key={item.href} item={item} className="text-brand-ink" />
          ))}
          <Link to="/docs" onClick={() => setOpen(false)} className="text-brand-link">
            Read the docs
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
