import { classifyImageKitError } from "./imagekit-error-handler";

// ImageKit configuration for client-side
export const getImageKitConfig = () => {
  try {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !urlEndpoint) {
      const error = new Error("ImageKit configuration is incomplete");
      const classifiedError = classifyImageKitError(error);
      console.error("ImageKit configuration missing:", {
        publicKey: !!publicKey,
        urlEndpoint: !!urlEndpoint,
        error: classifiedError,
      });
      throw classifiedError;
    }

    // Validate configuration format
    if (!urlEndpoint.startsWith("https://ik.imagekit.io/")) {
      console.warn(
        "ImageKit URL endpoint should start with https://ik.imagekit.io/"
      );
    }

    return {
      publicKey,
      urlEndpoint,
    };
  } catch (error) {
    const classifiedError = classifyImageKitError(error);
    throw classifiedError;
  }
};

// Server-side configuration check with enhanced validation
export const validateImageKitConfig = () => {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  const errors: string[] = [];
  if (!privateKey) errors.push("IMAGEKIT_PRIVATE_KEY");
  if (!publicKey) errors.push("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY");
  if (!urlEndpoint) errors.push("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT");

  const validation = {
    isValid: errors.length === 0,
    errors,
    warnings: [] as string[],
  };

  if (!validation.isValid) {
    const error = new Error(
      `Missing ImageKit environment variables: ${errors.join(", ")}`
    );
    throw classifyImageKitError(error);
  }

  // Validate URL endpoint format
  if (urlEndpoint && !urlEndpoint.startsWith("https://ik.imagekit.io/")) {
    validation.warnings.push(
      "URL endpoint should start with https://ik.imagekit.io/"
    );
  }

  return {
    privateKey: privateKey!,
    publicKey: publicKey!,
    urlEndpoint: urlEndpoint!,
    validation,
  };
};

// Configuration health check
export const checkImageKitHealth = async (): Promise<{
  status: "healthy" | "degraded" | "unhealthy";
  details: any;
}> => {
  try {
    const config = validateImageKitConfig();

    // Test API connectivity with a simple transformation
    const testUrl = `${config.urlEndpoint}/tr:w-1,h-1/placeholder.jpg`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(testUrl, {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok || response.status === 404) {
        // 404 is acceptable as placeholder.jpg might not exist
        return {
          status: "healthy",
          details: {
            config: "valid",
            connectivity: "ok",
            statusCode: response.status,
            timestamp: new Date().toISOString(),
          },
        };
      } else {
        return {
          status: "degraded",
          details: {
            config: "valid",
            connectivity: "limited",
            statusCode: response.status,
            timestamp: new Date().toISOString(),
          },
        };
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return {
          status: "degraded",
          details: {
            config: "valid",
            connectivity: "timeout",
            timestamp: new Date().toISOString(),
          },
        };
      }

      throw fetchError;
    }
  } catch (error) {
    const classifiedError = classifyImageKitError(error);
    return {
      status: "unhealthy",
      details: {
        error: classifiedError,
        timestamp: new Date().toISOString(),
      },
    };
  }
};
