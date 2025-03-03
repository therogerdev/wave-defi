import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navigation: React.FC = () => {
  return (
    <NavigationMenu delayDuration={0}>
      <NavigationMenuList className="hidden md:flex items-center mt-5 h-full space-x-4 lg:space-x-6 mx-6">
        {/* Swap Link */}
        <NavigationMenuItem>
          <Link href="/swaps" passHref legacyBehavior>
            <NavigationMenuLink
              className={cn(buttonVariants({ variant: "ghost" }), "-mb-2")}
            >
              Swap
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Pools Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(buttonVariants({ variant: "ghost" }), "-mb-2")}
            aria-label="Open Pools Menu"
          >
            Pools
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-background dark:bg-gray-800 rounded-lg shadow-lg">
            <ul className="grid gap-3 p-4 w-[350px]">
              <ListItem href="/liquidity/pool" title="Pool List">
                See all pools available
              </ListItem>
              <ListItem href="/liquidity/pool/create" title="Create Pool">
                Create a new liquidity pool
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href="/liquidity/pool"
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground dark:text-accent dark:hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground  group-hover:text-accent-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
