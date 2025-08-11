"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export function ImageKitTest() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    try {
      // Test 1: Environment variables
      const envTest = await fetch("/api/test-imagekit");
      const envData = await envTest.json();

      // Test 2: Authentication
      let authTest = null;
      try {
        const authResponse = await fetch("/api/upload-auth");
        if (authResponse.ok) {
          authTest = { success: true, data: await authResponse.json() };
        } else {
          authTest = { success: false, error: await authResponse.text() };
        }
      } catch (error) {
        authTest = { success: false, error: (error as Error).message };
      }

      // Test 3: Upload test
      let uploadTest = null;
      try {
        const uploadResponse = await fetch("/api/test-imagekit-upload", {
          method: "POST",
        });
        if (uploadResponse.ok) {
          uploadTest = { success: true, data: await uploadResponse.json() };
        } else {
          uploadTest = { success: false, error: await uploadResponse.text() };
        }
      } catch (error) {
        uploadTest = { success: false, error: (error as Error).message };
      }

      setTestResults({
        environment: envData,
        authentication: authTest,
        upload: uploadTest,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setTestResults({
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testUpload = async () => {
    setIsLoading(true);
    try {
      const uploadTest = await fetch("/api/test-imagekit-upload", {
        method: "POST",
      });

      const uploadData = await uploadTest.json();

      setTestResults({
        uploadTest: uploadData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setTestResults({
        error: "Upload test failed: " + (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          ImageKit Configuration Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runTest} disabled={isLoading} className="flex-1">
            {isLoading ? "Testing..." : "Run Config Test"}
          </Button>
          <Button
            onClick={testUpload}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            {isLoading ? "Testing..." : "Test Upload"}
          </Button>
        </div>

        {testResults && (
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">
              Last test: {new Date(testResults.timestamp).toLocaleString()}
            </div>

            {testResults.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-4 w-4" />
                  Test Failed
                </div>
                <p className="text-sm text-red-600 mt-1">{testResults.error}</p>
              </div>
            ) : testResults.uploadTest ? (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Upload Test Result</span>
                  {getStatusIcon(testResults.uploadTest.success)}
                </div>
                {testResults.uploadTest.success ? (
                  <div className="text-sm text-green-600">
                    ✓ Upload test successful!
                    <div className="text-xs text-muted-foreground mt-1">
                      File uploaded to ImageKit successfully
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-red-600">
                    ✗ Upload test failed
                    <div className="text-xs text-red-500 mt-1">
                      {testResults.uploadTest.error}
                      {testResults.uploadTest.details && (
                        <div className="mt-1 p-2 bg-red-50 rounded text-xs">
                          {testResults.uploadTest.details}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Environment Test */}
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Environment Variables</span>
                    {getStatusIcon(testResults.environment.allConfigured)}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Private Key:</span>
                      <Badge
                        variant={
                          testResults.environment.config.privateKey.includes(
                            "✓"
                          )
                            ? "default"
                            : "destructive"
                        }
                      >
                        {testResults.environment.config.privateKey}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Public Key:</span>
                      <Badge
                        variant={
                          testResults.environment.config.publicKey.includes("✓")
                            ? "default"
                            : "destructive"
                        }
                      >
                        {testResults.environment.config.publicKey}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>URL Endpoint:</span>
                      <Badge
                        variant={
                          testResults.environment.config.urlEndpoint.includes(
                            "✓"
                          )
                            ? "default"
                            : "destructive"
                        }
                      >
                        {testResults.environment.config.urlEndpoint}
                      </Badge>
                    </div>
                    {testResults.environment.config.urlEndpointValue && (
                      <div className="text-xs text-muted-foreground mt-1">
                        URL: {testResults.environment.config.urlEndpointValue}
                      </div>
                    )}
                  </div>
                </div>

                {/* Authentication Test */}
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Authentication</span>
                    {getStatusIcon(
                      testResults.authentication?.success || false
                    )}
                  </div>
                  {testResults.authentication?.success ? (
                    <div className="text-sm text-green-600">
                      ✓ Authentication successful
                      <div className="text-xs text-muted-foreground mt-1">
                        Token and signature generated successfully
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-red-600">
                      ✗ Authentication failed
                      <div className="text-xs text-red-500 mt-1">
                        {testResults.authentication?.error}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
