"use client";

import {
  LogOut,
  Settings,
  UserCircle,
  Sun,
  Moon,
  Monitor,
  Home,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";

export function UserNav() {
  const { data: session, isPending } = authClient.useSession();
  const { setTheme, theme } = useTheme();
  const sidebar = useStore(useSidebar, (x) => x);
  const isOpen = sidebar?.getOpenState();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  if (isPending) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-2",
          !isOpen && "justify-center"
        )}
      >
        <div className="h-8 w-8 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full" />
        {isOpen && (
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-2/3" />
          </div>
        )}
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full h-auto p-2 transition-all duration-200",
            "hover:bg-slate-50 dark:hover:bg-slate-900",
            !isOpen ? "justify-center" : "justify-start"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-3",
              !isOpen && "justify-center"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user.image || ""}
                alt={session.user.name || session.user.email || "User"}
              />
              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {session.user.name
                  ? session.user.name.charAt(0).toUpperCase()
                  : session.user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {isOpen && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {session.user.name || "Kullanıcı"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {session.user.email}
                </p>
              </div>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name || "Kullanıcı"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Ayarlar</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Tema
        </DropdownMenuLabel>

        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Aydınlık</span>
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Koyu</span>
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>Sistem</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Ana Siteye Dön</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 dark:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Çıkış Yap</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
