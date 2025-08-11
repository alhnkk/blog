"use client";

import Link from "next/link";
import { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface EnhancedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  showProgress?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
}

export function EnhancedLink({
  href,
  children,
  className,
  prefetch = true,
  showProgress = true,
  onClick,
  target,
  rel,
}: EnhancedLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Don't intercept external links or links with target="_blank"
    if (
      target === "_blank" ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    // Don't intercept if default is prevented
    if (e.defaultPrevented) {
      return;
    }

    // Don't intercept if modifier keys are pressed
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    // Use Next.js router for navigation (this will trigger our NavigationProgress)
    e.preventDefault();
    router.push(href);
  };

  const handleMouseEnter = () => {
    if (prefetch && !href.startsWith("http")) {
      router.prefetch(href);
    }
  };

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      target={target}
      rel={rel}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}
