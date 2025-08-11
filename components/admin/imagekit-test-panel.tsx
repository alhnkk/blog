"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Upload,
  Settings,
} from "lucide-react";
import { checkImageKitHealth } from "@/lib/imagekit-config";
import { ImageUploaderEnhanced } from "@/components/ui/image-uploader-enhanced";

interface TestResult {
  name: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: any;
}

export function ImageKitTestPanel() {
  const [isTestingConfig, setIsTestingConfig] = useState(false);

  const [configResults, setConfigResults] = useState<TestResult[]>([]);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const testConfiguration = async () => {
    setIsTestingConfig(true);
    const results: TestResult[] = [];

    try {
      // Test client-side environment variables
      const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
      const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

      if (publicKey) {
        results.push({
          name: "Environment Variable: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
          status: "success",
          message: "✓ Configured",
          details: publicKey.substring(0, 20) + "...",
        });
      } else {
        results.push({
          name: "Environment Variable: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
          status: "error",
          message: "✗ Missing",
          details: "This environment variable is required",
        });
      }

      if (urlEndpoint) {
        results.push({
          name: "Environment Variable: NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
          status: "success",
          message: "✓ Configured",
          details: urlEndpoint,
        });
      } else {
        results.push({
          name: "Environment Variable: NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
          status: "error",
          message: "✗ Missing",
          details: "This environment variable is required",
        });
      }

      // Test API endpoint
      try {
        const response = await fetch("/api/upload-auth");
        if (response.ok) {
          const data = await response.json();
          results.push({
            name: "Upload Auth API",
            status: "success",
            message: "✓ API endpoint working",
            details: data,
          });
        } else {
          const errorText = await response.text();
          results.push({
            name: "Upload Auth API",
            status: "error",
            message: `✗ API error (${response.status})`,
            details: errorText,
          });
        }
      } catch (error) {
        results.push({
          name: "Upload Auth API",
          status: "error",
          message: "✗ API endpoint unreachable",
          details: error,
        });
      }

      // Test ImageKit health
      try {
        const health = await checkImageKitHealth();
        setHealthStatus(health);

        results.push({
          name: "ImageKit Service Health",
          status:
            health.status === "healthy"
              ? "success"
              : health.status === "degraded"
              ? "warning"
              : "error",
          message: `${
            health.status === "healthy"
              ? "✓"
              : health.status === "degraded"
              ? "⚠"
              : "✗"
          } ${health.status}`,
          details: health.details,
        });
      } catch (error) {
        results.push({
          name: "ImageKit Service Health",
          status: "error",
          message: "✗ Health check failed",
          details: error,
        });
      }
    } catch (error) {
      results.push({
        name: "Configuration Test",
        status: "error",
        message: "✗ Test failed",
        details: error,
      });
    }

    setConfigResults(results);
    setIsTestingConfig(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            Success
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Warning
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            ImageKit Configuration Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={testConfiguration}
              disabled={isTestingConfig}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isTestingConfig ? "animate-spin" : ""}`}
              />
              {isTestingConfig ? "Testing..." : "Test Configuration"}
            </Button>
          </div>

          {configResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Test Results:</h4>
              {configResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{result.name}</span>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.message}
                    </p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer">
                          Show details
                        </summary>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                          {typeof result.details === "string"
                            ? result.details
                            : JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {healthStatus && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>ImageKit Health Status:</strong> {healthStatus.status}
                <br />
                <small>Last checked: {healthStatus.details.timestamp}</small>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Functionality Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Test the image upload functionality with a real file:
            </p>

            <ImageUploaderEnhanced
              onUploadSuccess={(url, fileId) => {
                setUploadResult(
                  `Upload successful! URL: ${url}, File ID: ${fileId}`
                );
              }}
              onUploadError={(error) => {
                setUploadResult(
                  `Upload failed: ${error.userMessage || error.message}`
                );
              }}
              folder="/test-uploads"
              maxFileSize={5}
              showPreview={true}
              enableRetry={true}
              fallbackUrl="/images/placeholder.jpg"
            />

            {uploadResult && (
              <Alert>
                <AlertDescription>
                  <strong>Upload Result:</strong> {uploadResult}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
