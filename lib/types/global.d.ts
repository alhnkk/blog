// Global type declarations for the blog platform

import { User } from "./index";

// Extend the global namespace
declare global {
  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      DATABASE_URL: string;

      // BetterAuth
      BETTER_AUTH_SECRET: string;
      BETTER_AUTH_URL: string;

      // OAuth Providers
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      // ImageKit
      IMAGEKIT_PUBLIC_KEY: string;
      IMAGEKIT_PRIVATE_KEY: string;
      IMAGEKIT_URL_ENDPOINT: string;

      // Optional environment variables
      NODE_ENV: "development" | "production" | "test";
      NEXT_PUBLIC_APP_URL?: string;
      NEXT_PUBLIC_SITE_NAME?: string;

      // Email (optional)
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASS?: string;
      SMTP_FROM?: string;

      // Analytics (optional)
      NEXT_PUBLIC_GA_ID?: string;
      NEXT_PUBLIC_HOTJAR_ID?: string;

      // Monitoring (optional)
      SENTRY_DSN?: string;
      SENTRY_ORG?: string;
      SENTRY_PROJECT?: string;

      // Redis (optional for caching)
      REDIS_URL?: string;

      // File storage (optional)
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
      AWS_REGION?: string;
      AWS_S3_BUCKET?: string;
    }
  }

  // Window object extensions
  interface Window {
    // Analytics
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];

    // Hotjar
    hj?: (...args: any[]) => void;
    _hjSettings?: {
      hjid: number;
      hjsv: number;
    };

    // Theme
    __theme?: "light" | "dark";
    __setPreferredTheme?: (theme: "light" | "dark") => void;

    // PWA
    workbox?: any;

    // Custom events
    __blog_events?: {
      postView: (postId: string) => void;
      commentSubmit: (postId: string, commentId: string) => void;
      searchPerformed: (query: string, results: number) => void;
    };
  }

  // Custom JSX elements (if needed)
  namespace JSX {
    interface IntrinsicElements {
      // Custom elements can be defined here if needed
    }
  }
}

// Module declarations for packages without types
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

declare module "*.ico" {
  const content: string;
  export default content;
}

declare module "*.bmp" {
  const content: string;
  export default content;
}

// CSS Modules
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

// JSON files
declare module "*.json" {
  const content: any;
  export default content;
}

// Markdown files
declare module "*.md" {
  const content: string;
  export default content;
}

declare module "*.mdx" {
  const content: React.ComponentType;
  export default content;
}

// Web Workers
declare module "*.worker.ts" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

// WASM files
declare module "*.wasm" {
  const content: WebAssembly.Module;
  export default content;
}

// Font files
declare module "*.woff" {
  const content: string;
  export default content;
}

declare module "*.woff2" {
  const content: string;
  export default content;
}

declare module "*.ttf" {
  const content: string;
  export default content;
}

declare module "*.eot" {
  const content: string;
  export default content;
}

// Audio/Video files
declare module "*.mp3" {
  const content: string;
  export default content;
}

declare module "*.mp4" {
  const content: string;
  export default content;
}

declare module "*.webm" {
  const content: string;
  export default content;
}

// Extend existing modules
declare module "better-auth" {
  interface User {
    role: "USER" | "ADMIN";
  }
}

declare module "better-auth/client" {
  interface User {
    role: "USER" | "ADMIN";
  }
}

// Prisma extensions
declare module "@prisma/client" {
  interface User {
    role: "USER" | "ADMIN";
  }
}

// Next.js extensions
declare module "next" {
  interface NextApiRequest {
    user?: User;
    session?: {
      user: User;
      expires: string;
    };
  }
}

declare module "next/server" {
  interface NextRequest {
    user?: User;
    session?: {
      user: User;
      expires: string;
    };
  }
}

// React extensions
declare module "react" {
  interface HTMLAttributes<T> {
    // Custom data attributes
    "data-testid"?: string;
    "data-cy"?: string;
    "data-theme"?: "light" | "dark";
  }
}

// Export empty object to make this a module
export {};
