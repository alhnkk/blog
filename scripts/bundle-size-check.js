#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Bundle size limits (in bytes)
const LIMITS = {
  entrypoint: 500 * 1024, // 500KB
  chunk: 250 * 1024, // 250KB
  asset: 500 * 1024, // 500KB
};

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function checkBundleSize() {
  const buildDir = path.join(process.cwd(), ".next");
  const buildManifest = path.join(buildDir, "build-manifest.json");

  if (!fs.existsSync(buildManifest)) {
    console.error('❌ Build manifest not found. Run "npm run build" first.');
    process.exit(1);
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(buildManifest, "utf8"));
    const staticDir = path.join(buildDir, "static");

    let hasErrors = false;
    const warnings = [];
    const errors = [];

    // Check entrypoints
    Object.entries(manifest.pages).forEach(([page, files]) => {
      let totalSize = 0;

      files.forEach((file) => {
        const filePath = path.join(staticDir, file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        }
      });

      if (totalSize > LIMITS.entrypoint) {
        const message = `Entrypoint "${page}" (${formatBytes(
          totalSize
        )}) exceeds limit (${formatBytes(LIMITS.entrypoint)})`;
        if (totalSize > LIMITS.entrypoint * 1.5) {
          errors.push(message);
          hasErrors = true;
        } else {
          warnings.push(message);
        }
      }
    });

    // Report results
    if (warnings.length > 0) {
      console.warn("\n⚠️  Bundle Size Warnings:");
      warnings.forEach((warning) => console.warn(`  ${warning}`));
    }

    if (errors.length > 0) {
      console.error("\n❌ Bundle Size Errors:");
      errors.forEach((error) => console.error(`  ${error}`));
    }

    if (warnings.length === 0 && errors.length === 0) {
      console.log("✅ All bundle sizes are within limits!");
    }

    // Show current bundle stats
    console.log("\n📊 Current Bundle Stats:");
    const totalEntrypoints = Object.keys(manifest.pages).length;
    console.log(`  Total entrypoints: ${totalEntrypoints}`);

    // Calculate total size
    let totalBundleSize = 0;
    Object.values(manifest.pages).forEach((files) => {
      files.forEach((file) => {
        const filePath = path.join(staticDir, file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          totalBundleSize += stats.size;
        }
      });
    });

    console.log(`  Total bundle size: ${formatBytes(totalBundleSize)}`);
    console.log(
      `  Average per entrypoint: ${formatBytes(
        totalBundleSize / totalEntrypoints
      )}`
    );

    // Suggestions
    if (warnings.length > 0 || errors.length > 0) {
      console.log("\n💡 Suggestions to reduce bundle size:");
      console.log("  • Use dynamic imports for large components");
      console.log("  • Enable tree shaking for unused code");
      console.log("  • Split vendor chunks more granularly");
      console.log("  • Use next/dynamic for heavy components");
      console.log("  • Consider lazy loading non-critical features");
      console.log("  • Remove unused dependencies");
      console.log("  • Optimize images and assets");
    }

    return !hasErrors;
  } catch (error) {
    console.error("❌ Error checking bundle size:", error.message);
    return false;
  }
}

if (require.main === module) {
  const success = checkBundleSize();
  process.exit(success ? 0 : 1);
}

module.exports = { checkBundleSize };
