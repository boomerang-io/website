import * as React from "react";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { siteConfig } from "~/config/site";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { navConfig } from "~/config/nav";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import iconsHref from "~/icons.svg";
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { docConfig } from "~/config/doc";

type HeaderProps = {
  className?: string;
  versionData?: {
    versions: string[];
    latestVersion?: string;
    releaseBranch?: string;
    branches?: string[];
    currentRef?: string;
    lang?: string;
  };
};

export function Header({ className, versionData }: HeaderProps) {
  let navigate = useNavigate();
  let { versions, latestVersion, releaseBranch, currentRef, branches, lang } =
    versionData || {};

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className=" mr-6 flex items-center space-x-4">
            <img
              src="/boomerang-logo-dark.svg"
              className="h-7"
              alt={siteConfig.name}
            />
            <span className="sr-only">{siteConfig.name}</span>
          </Link>
          {versionData && (
            <nav className="flex items-center text-sm">
              <Select
                onValueChange={(v) => navigate(`/docs/${lang}/` + v)}
                defaultValue={currentRef}
              >
                <SelectTrigger
                  id="version"
                  className="w-40 border border-none shadow-none rounded-md h-md py-2 text-md font-medium bg-accent focus:outline-none"
                >
                  <SelectValue placeholder="Select a version" />
                </SelectTrigger>
                <SelectContent position="popper" className="w-56 r-md">
                  <SelectGroup>
                    {branches && branches.length > 0 && (
                      <SelectLabel className="text-sm text-muted-foreground font-light">
                        Branches
                      </SelectLabel>
                    )}
                    <SelectSeparator />
                    {branches?.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    {versions && versions?.length > 0 && (
                      <SelectLabel className="text-sm text-muted-foreground font-light">
                        Versions
                      </SelectLabel>
                    )}
                    <SelectSeparator />
                    {versions?.map((version) => (
                      <SelectItem key={version} value={version}>
                        {/* Strip the prefix from the tag name to show in the dropdown */}
                        {version}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </nav>
          )}
        </div>
        <MainNav />
        <MobileNav />
      </div>
    </header>
  );
}

function MainNav() {
  return (
    <div className="hidden md:flex flex-1 items-center justify-between gap-6 md:justify-end">
      <NavigationMenu>
        <NavigationMenuList>
          {navConfig.mainNav?.map((item) =>
            item.children && item.children.length > 0 ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-2 rounded-md">
                    {item.children.map((child, index) => (
                      <li key={index}>
                        <NavigationMenuLink asChild>
                          <Link
                            className={
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            }
                            to={child.href}
                          >
                            <div className="text-sm font-medium leading-none">
                              {child.title}
                            </div>
                            <p className="line-clamp-2 text-sm font-normal leading-snug text-muted-foreground">
                              {child.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <Link to={item.href}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )
          )}
          <NavigationMenuItem>
            <Link key="github" to={siteConfig.github.repoUrl}>
              <NavigationMenuLink className="h-10 w-10 place-items-center text-black hover:text-gray-600 md:grid">
                <span className="sr-only">"View on GitHub"</span>
                <svg aria-hidden style={{ width: `24px`, height: `24px` }}>
                  <use href={`${iconsHref}#github`} />
                </svg>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              key="slack"
              to="https://join.slack.com/t/boomerang-io/shared_invite/zt-pxo2yw2o-c3~6YvWkKNrKIwhIBAKhaw"
            >
              <NavigationMenuLink className="h-10 w-10 place-items-center text-black hover:text-gray-600 md:grid">
                <span className="sr-only">"Chat on Slack"</span>
                <img
                  aria-hidden
                  style={{ width: `24px`, height: `24px` }}
                  src="/logo/slack.svg"
                />
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="md:hidden flex flex-1 items-center space-x-2 justify-end">
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 justify-end px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <HamburgerMenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent side="left" className="">
        <Link to="/" className="flex items-center">
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 px-3">
          <div className="flex flex-col space-y-3">
            {navConfig.mainNav?.map((item) =>
              item.children && item.children.length > 0 ? (
                <>
                  <Label className="text-sm text-muted-foreground font-light">
                    {item.title}
                  </Label>
                  <Separator />
                  {item.children.map((child, index) => (
                    <Link key={index} to={child.href} className="pl-5">
                      {child.title}
                    </Link>
                  ))}
                </>
              ) : (
                <Link key={item.href} to={item.href}>
                  {item.title}
                </Link>
              )
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
