import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
}

const defaultSocialLinks = [
  { icon: <FaTwitter className="w-5 h-5" />, href: "#", label: "Twitter" },
  { icon: <FaGithub className="w-5 h-5" />, href: "#", label: "GitHub" },
  { icon: <FaLinkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
];

const Footer = ({
  logo = {
    url: "/",
    src: "/logo.jpeg",
    alt: "JURNALİZE Logo",
    title: "JURNALİZE",
  },
  description = "Düşüncelerinizi paylaşın, hikayelerinizi anlatın.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2024 JURNALİZE. Tüm hakları saklıdır.",
}: FooterProps) => {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          {/* Logo ve Başlık */}
          <Link href={logo.url} className="flex items-center space-x-3 group">
            <Image
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              className="h-8 w-8 rounded-full transition-transform group-hover:scale-105"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {logo.title}
            </span>
          </Link>

          {/* Açıklama */}
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            {description}
          </p>

          {/* Sosyal Medya Linkleri */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social, idx) => (
              <Link
                key={idx}
                href={social.href}
                aria-label={social.label}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent"
              >
                {social.icon}
              </Link>
            ))}
          </div>

          {/* Telif Hakkı */}
          <div className="pt-6 border-t border-border/40 w-full">
            <p className="text-xs text-muted-foreground">{copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
