import {
  Tag,
  Users,
  Bookmark,
  SquarePen,
  LayoutGrid,
  MessageCircle,
  Mail,
  Search,
  LucideIcon,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "İçerik",
      menus: [
        {
          href: "",
          label: "Gönderiler",
          icon: SquarePen,
          submenus: [
            {
              href: "/admin/posts",
              label: "Tüm Gönderiler",
            },
            {
              href: "/admin/posts/new",
              label: "Yeni Gönderi",
            },
          ],
        },
        {
          href: "/admin/categories",
          label: "Kategoriler",
          icon: Bookmark,
        },
        {
          href: "/admin/tags",
          label: "Etiketler",
          icon: Tag,
        },
        {
          href: "/admin/comments",
          label: "Yorumlar",
          icon: MessageCircle,
        },
        {
          href: "/admin/messages",
          label: "İletişim Mesajları",
          icon: Mail,
        },
      ],
    },
    {
      groupLabel: "Ayarlar",
      menus: [
        {
          href: "/admin/users",
          label: "Kullanıcılar",
          icon: Users,
        },
        {
          href: "/admin/seo",
          label: "SEO Paneli",
          icon: Search,
        },
      ],
    },
  ];
}
