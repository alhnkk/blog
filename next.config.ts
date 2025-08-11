import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Output configuration for better build handling
  output: "standalone",

  // Generate static pages where possible, but allow dynamic for admin routes
  generateStaticParams: true,

  // Caching headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, s-maxage=300",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
    // Remove global custom loader to fix local image issues
    // loader: "custom",
    // loaderFile: "./lib/imagekit-loader.ts",
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "react-icons",
    ],
    // optimizeCss: true, // Temporarily disabled due to critters issue
    optimizeServerReact: true,
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Bundle analyzer için
  webpack: (config, { dev, isServer, webpack }) => {
    // Bundle analyzer integration
    if (process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("@next/bundle-analyzer")();
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: true,
          reportFilename: isServer
            ? "../analyze/server.html"
            : "./analyze/client.html",
        })
      );
    }

    // Production optimizations
    if (!dev && !isServer) {
      // Enhanced splitChunks configuration
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 10000,
        maxSize: 150000, // Daha küçük chunk'lar
        minChunks: 1,
        maxAsyncRequests: 50, // Daha fazla async request'e izin ver
        maxInitialRequests: 20, // Initial request sayısını azalt
        enforceSizeThreshold: 30000,
        cacheGroups: {
          // Framework chunk (React, Next.js core)
          framework: {
            chunks: "all",
            name: "framework",
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },

          // Core Radix UI components (frequently used)
          "radix-ui-core": {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/](react-slot|react-primitive|react-compose-refs|react-context|react-use-controllable-state|react-use-previous|react-use-callback-ref|react-use-escape-keydown|react-use-layout-effect|react-dismissable-layer|react-focus-guards|react-focus-scope|react-id|react-portal|react-presence|react-roving-focus|react-use-rect|react-visually-hidden)[\\/]/,
            name: "radix-ui-core",
            priority: 35,
            chunks: "all",
            enforce: true,
          },

          // Dialog related components
          "radix-ui-dialog": {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/](react-dialog|react-alert-dialog|react-popover|react-dropdown-menu)[\\/]/,
            name: "radix-ui-dialog",
            priority: 32,
            chunks: "all",
            enforce: true,
          },

          // Form related components
          "radix-ui-form": {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/](react-label|react-checkbox|react-switch|react-select|react-slider|react-radio-group)[\\/]/,
            name: "radix-ui-form",
            priority: 32,
            chunks: "all",
            enforce: true,
          },

          // Navigation components
          "radix-ui-nav": {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/](react-navigation-menu|react-tabs|react-accordion|react-collapsible)[\\/]/,
            name: "radix-ui-nav",
            priority: 32,
            chunks: "all",
            enforce: true,
          },

          // Other Radix UI components
          "radix-ui-misc": {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: "radix-ui-misc",
            priority: 30,
            chunks: "all",
            enforce: true,
          },

          // TipTap Editor chunk
          tiptapEditor: {
            test: /[\\/]node_modules[\\/]@tiptap[\\/]/,
            name: "tiptap-editor",
            priority: 30,
            chunks: "all",
            enforce: true,
          },

          // Icons chunk (Lucide, React Icons)
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react|react-icons)[\\/]/,
            name: "icons",
            priority: 25,
            chunks: "all",
            enforce: true,
          },

          // Form libraries chunk
          forms: {
            test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
            name: "forms",
            priority: 25,
            chunks: "all",
            enforce: true,
          },

          // State management chunk
          state: {
            test: /[\\/]node_modules[\\/](zustand|immer)[\\/]/,
            name: "state-management",
            priority: 25,
            chunks: "all",
            enforce: true,
          },

          // Utilities chunk (date-fns, clsx, etc.)
          utilities: {
            test: /[\\/]node_modules[\\/](date-fns|clsx|class-variance-authority|tailwind-merge)[\\/]/,
            name: "utilities",
            priority: 20,
            chunks: "all",
            enforce: true,
          },

          // Auth chunk
          auth: {
            test: /[\\/]node_modules[\\/](better-auth|bcryptjs)[\\/]/,
            name: "auth",
            priority: 20,
            chunks: "all",
            enforce: true,
          },

          // Common vendor chunk (remaining node_modules)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            priority: 10,
            chunks: "all",
            reuseExistingChunk: true,
          },

          // Common application code
          common: {
            name: "common",
            minChunks: 2,
            priority: 5,
            chunks: "all",
            reuseExistingChunk: true,
          },

          // Default chunk
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };

      // Bundle size monitoring
      config.plugins.push(
        new webpack.DefinePlugin({
          "process.env.BUNDLE_ANALYZE": JSON.stringify(
            process.env.ANALYZE || "false"
          ),
        })
      );

      // Tree shaking optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // CSS optimization
      if (config.optimization.splitChunks) {
        config.optimization.splitChunks.cacheGroups.styles = {
          name: "styles",
          test: /\.(css|scss|sass)$/,
          chunks: "all",
          enforce: true,
          priority: 50,
        };
      }

      // Disable bundle size warnings for now (they're just warnings)
      config.performance = {
        hints: false, // Disable warnings to reduce noise
      };
    }

    return config;
  },
};

export default nextConfig;
