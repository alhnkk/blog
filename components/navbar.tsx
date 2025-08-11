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
import Image from "next/image";

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
import { getCategories } from "@/lib/actions/category";
import { NavbarClient } from "./navbar-client";
import { CategoryWithCount } from "@/lib/types";

const Navbar = async () => {
  const categories = await getCategories();
  const limitedCategories: CategoryWithCount[] = categories.slice(0, 6); // Sadece ilk 6 kategoriyi göster

  return <NavbarClient categories={limitedCategories} />;
};

export { Navbar };
