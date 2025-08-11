import { NextRequest, NextResponse } from "next/server";
import { getUploadAuthParams } from "@imagekit/next/server";
import { validateImageKitConfig } from "@/lib/imagekit-config";
import { classifyImageKitError } from "@/lib/imagekit-error-handler";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    console.log("Upload auth request received");

    // Check environment variables first
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    console.log("Environment check:", {
      hasPrivateKey: !!privateKey,
      hasPublicKey: !!publicKey,
      hasUrlEndpoint: !!urlEndpoint,
    });

    if (!privateKey || !publicKey || !urlEndpoint) {
      const missingVars = [];
      if (!privateKey) missingVars.push("IMAGEKIT_PRIVATE_KEY");
      if (!publicKey) missingVars.push("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY");
      if (!urlEndpoint) missingVars.push("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT");

      console.error("Missing environment variables:", missingVars);
      return NextResponse.json(
        {
          error: "ImageKit yapılandırması eksik",
          code: "CONFIG_MISSING",
          retryable: false,
          details: { missingVars },
        },
        { status: 500 }
      );
    }

    // Generate upload authentication parameters manually
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes from now

    // Create signature using HMAC-SHA1
    const stringToSign = token + expire;
    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(stringToSign)
      .digest("hex");

    console.log("Generated ImageKit auth params:", {
      hasToken: !!token,
      hasSignature: !!signature,
      expire: expire,
      currentTime: Math.floor(Date.now() / 1000),
    });

    return NextResponse.json({
      token: token,
      expire: expire,
      signature: signature,
      publicKey: publicKey,
      urlEndpoint: urlEndpoint,
      success: true,
    });
  } catch (error) {
    console.error("Error generating ImageKit auth params:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    const classifiedError = classifyImageKitError(error);

    return NextResponse.json(
      {
        error: classifiedError.userMessage,
        code: classifiedError.code,
        retryable: classifiedError.retryable,
        details:
          process.env.NODE_ENV === "development"
            ? {
                originalError:
                  error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                ...classifiedError.details,
              }
            : undefined,
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
