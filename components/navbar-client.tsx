"use client";

import {
  MenuIcon,
  LogOut,
  Settings,
  UserCircle,
  Sun,
  Moon,
  Monitor,
  Search,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { SearchModal } from "@/components/search-modal";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

import { CategoryWithCount } from "@/lib/types";

interface NavbarClientProps {
  categories: CategoryWithCount[];
}

export const NavbarClient = ({ categories }: NavbarClientProps) => {
  const { data: session, isPending } = authClient.useSession();
  const { setTheme, theme } = useTheme();
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useKeyboardShortcut(["ctrl", "k"], () => setSearchModalOpen(true));
  useKeyboardShortcut(["meta", "k"], () => setSearchModalOpen(true));

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <section className="bg-accent dark:bg-background py-5 border-b border-gray-300 dark:border-border px-4 lg:px-0">
      <div className="container max-w-7xl mx-auto">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 font-serif">
            <Image
              src="/logo.jpeg"
              width={30}
              height={30}
              alt="logo"
              className="aspect-square rounded-full"
            />
            <span className="text-2xl font-semibold tracking-tighter font-serif">
              JURNALİZE
            </span>
          </Link>
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList className="flex items-center space-x-6">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className={navigationMenuTriggerStyle()}
                >
                  ANA SAYFA
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>KATEGORİLER</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {categories.map((category) => (
                      <NavigationMenuLink
                        href={`/categories/${category.slug}`}
                        key={category.id}
                        className="rounded-md p-3 transition-colors hover:bg-muted/70"
                      >
                        <div>
                          <p className="mb-1 font-semibold text-foreground">
                            {category.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {category.description ||
                              `${category.name} konulu yazılar`}{" "}
                            ({category._count.posts} yazı)
                          </p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/contact"
                  className={navigationMenuTriggerStyle()}
                >
                  İLETİŞİM
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={navigationMenuTriggerStyle()}
                >
                  NEWSLETTER
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden items-center gap-4 lg:flex">
            <Button
              variant="ghost"
              onClick={() => setSearchModalOpen(true)}
              className="relative flex items-center gap-2 px-3"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:inline">Ara</span>
              <kbd className="hidden xl:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            {isPending ? (
              <div className="h-8 w-20 animate-pulse bg-muted rounded" />
            ) : session ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image || ""}
                          alt={
                            session.user.name || session.user.email || "User"
                          }
                        />
                        <AvatarFallback className="bg-primary/10">
                          {session.user.name
                            ? session.user.name.charAt(0).toUpperCase()
                            : session.user.email?.charAt(0).toUpperCase() ||
                              "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
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
                    {session.user.role === "ADMIN" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button onClick={() => redirect("/login")} variant="link">
                  Giriş Yap
                </Button>
                <Button onClick={() => redirect("/register")} variant="ghost">
                  Kayıt Ol
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                      <span className="sr-only">Tema</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center space-x-2 font-serif"
                  >
                    <Image
                      src="/logo.jpeg"
                      width={30}
                      height={30}
                      alt="logo"
                      className="aspect-square rounded-full"
                    />
                    <span className="text-2xl font-semibold tracking-tighter font-serif">
                      JURNALİZE
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mt-4 mb-2">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      KATEGORİLER
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {categories.map((category) => (
                          <Link
                            href={`/categories/${category.slug}`}
                            key={category.id}
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                          >
                            <div>
                              <p className="mb-1 font-semibold text-foreground">
                                {category.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {category.description ||
                                  `${category.name} konulu yazılar`}{" "}
                                ({category._count.posts} yazı)
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-6">
                  <Link href="/" className="font-medium">
                    ANA SAYFA
                  </Link>
                  <Link href="/iletisim" className="font-medium">
                    İLETİŞİM
                  </Link>
                  <Link href="#" className="font-medium">
                    NEWSLETTER
                  </Link>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setSearchModalOpen(true)}
                    className="flex items-center justify-start gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Ara
                  </Button>
                  {isPending ? (
                    <div className="h-10 animate-pulse bg-muted rounded" />
                  ) : session ? (
                    <>
                      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={session.user.image || ""}
                            alt={
                              session.user.name || session.user.email || "User"
                            }
                          />
                          <AvatarFallback className="bg-primary/10 text-lg">
                            {session.user.name
                              ? session.user.name.charAt(0).toUpperCase()
                              : session.user.email?.charAt(0).toUpperCase() ||
                                "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {session.user.name || "Kullanıcı"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {session.user.email}
                          </span>
                        </div>
                      </div>
                      <Button asChild variant="outline">
                        <Link
                          href="/profile"
                          className="flex items-center justify-start"
                        >
                          <UserCircle className="mr-2 h-4 w-4" />
                          Profil
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link
                          href="/settings"
                          className="flex items-center justify-start"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Ayarlar
                        </Link>
                      </Button>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground px-2">
                          Tema
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={theme === "light" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("light")}
                            className="flex flex-col items-center gap-1 h-auto py-2"
                          >
                            <Sun className="h-4 w-4" />
                            <span className="text-xs">Aydınlık</span>
                          </Button>
                          <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("dark")}
                            className="flex flex-col items-center gap-1 h-auto py-2"
                          >
                            <Moon className="h-4 w-4" />
                            <span className="text-xs">Koyu</span>
                          </Button>
                          <Button
                            variant={theme === "system" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("system")}
                            className="flex flex-col items-center gap-1 h-auto py-2"
                          >
                            <Monitor className="h-4 w-4" />
                            <span className="text-xs">Sistem</span>
                          </Button>
                        </div>
                      </div>

                      {session.user.role === "ADMIN" && (
                        <Button asChild variant="outline">
                          <Link
                            href="/admin"
                            className="flex items-center justify-start"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </Button>
                      )}
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="flex items-center justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Çıkış Yap
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => redirect("/login")}
                        variant="outline"
                      >
                        Giriş Yap
                      </Button>
                      <Button
                        onClick={() => redirect("/register")}
                        variant="outline"
                      >
                        Kayıt Ol
                      </Button>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground px-2">
                          Tema
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={theme === "light" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("light")}
                            className="flex flex-col items-center gap-1 h-auto py-2"
                          >
                            <Sun className="h-4 w-4" />
                            <span className="text-xs">Aydınlık</span>
                          </Button>
                          <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("dark")}
                            className="flex flex-col items-center gap-1 h-auto py-2"
                          >
                            <Moon className="h-4 w-4" />
                            <span className="text-xs">Koyu</span>
                          </Button>
                          <Button
                            variant={theme === "system" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme("system")}
                            className="flex flex-col items-center gap-1 h-auto py-2"
                          >
                            <Monitor className="h-4 w-4" />
                            <span className="text-xs">Sistem</span>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
    </section>
  );
};
