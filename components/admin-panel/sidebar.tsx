"use client";
import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-all ease-in-out duration-300",
        !getOpenState() ? "w-16" : "w-64",
        settings.disabled && "hidden"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800"
      >
        {/* Clean Header */}
        <div className="px-4 py-6 border-b border-slate-200 dark:border-slate-800">
          <Button
            className={cn(
              "transition-all duration-300 w-full",
              !getOpenState() ? "justify-center p-2" : "justify-start p-3"
            )}
            variant="ghost"
            asChild
          >
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                width={32}
                height={32}
                src="/logo.jpeg"
                alt="Jurnalize Logo"
                className="w-8 h-8 rounded-lg"
              />
              <div
                className={cn(
                  "transition-all duration-300",
                  !getOpenState()
                    ? "opacity-0 w-0 overflow-hidden"
                    : "opacity-100"
                )}
              >
                <h1 className="font-semibold text-slate-900 dark:text-white">
                  Jurnalize
                </h1>
              </div>
            </Link>
          </Button>
        </div>

        {/* Menu */}
        <div className="flex-1 py-4">
          <Menu isOpen={getOpenState()} />
        </div>
      </div>
    </aside>
  );
}
