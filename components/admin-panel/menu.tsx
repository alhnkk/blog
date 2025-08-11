"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import { UserNav } from "@/components/admin-panel/user-nav";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <ScrollArea className="[&>div>div[style]]:!block h-full">
      <nav className="h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-200px)] items-start space-y-2 px-3">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li
              className={cn("w-full", groupLabel ? "pt-4 first:pt-0" : "")}
              key={index}
            >
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <div className="px-2 pb-2">
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {groupLabel}
                  </h3>
                </div>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <div className="w-full flex justify-center items-center py-2">
                  <div className="w-4 h-px bg-slate-300 dark:bg-slate-600" />
                </div>
              ) : (
                <div className="pb-1"></div>
              )}

              <div className="space-y-1">
                {menus.map(
                  ({ href, label, icon: Icon, active, submenus }, menuIndex) =>
                    !submenus || submenus.length === 0 ? (
                      <div className="w-full" key={menuIndex}>
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full h-10 transition-all duration-200",
                                  (active === undefined &&
                                    pathname.startsWith(href)) ||
                                    active
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white",
                                  !isOpen
                                    ? "justify-center px-0"
                                    : "justify-start px-3"
                                )}
                                asChild
                              >
                                <Link href={href}>
                                  <Icon
                                    size={18}
                                    className={cn(!isOpen ? "" : "mr-3")}
                                  />
                                  <span
                                    className={cn(
                                      "transition-all duration-300 truncate",
                                      isOpen === false
                                        ? "opacity-0 w-0 overflow-hidden"
                                        : "opacity-100"
                                    )}
                                  >
                                    {label}
                                  </span>
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            {isOpen === false && (
                              <TooltipContent side="right">
                                {label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="w-full" key={menuIndex}>
                        <CollapseMenuButton
                          icon={Icon}
                          label={label}
                          active={
                            active === undefined
                              ? pathname.startsWith(href)
                              : active
                          }
                          submenus={submenus}
                          isOpen={isOpen}
                        />
                      </div>
                    )
                )}
              </div>
            </li>
          ))}

          {/* User Navigation at bottom */}
          <li className="w-full flex-1 flex items-end pb-4">
            <div className="w-full">
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <UserNav />
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
