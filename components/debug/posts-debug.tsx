"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function PostsDebug() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug-posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Posts fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Posts Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={fetchPosts} disabled={loading}>
          {loading ? "Loading..." : "Fetch Posts"}
        </Button>

        {posts.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Found {posts.length} posts:</h3>
            {posts.map((post) => (
              <div key={post.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{post.title}</span>
                  <Badge
                    variant={
                      post.status === "PUBLISHED" ? "default" : "secondary"
                    }
                  >
                    {post.status}
                  </Badge>
                </div>

                <div className="text-sm space-y-1">
                  <div>
                    <strong>Slug:</strong> {post.slug}
                  </div>
                  <div>
                    <strong>Cover Image:</strong> {post.coverImage || "NULL"}
                  </div>
                  <div>
                    <strong>Author:</strong> {post.author?.name || "Unknown"}
                  </div>
                  <div>
                    <strong>Created:</strong>{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {post.coverImage && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">
                      Image Preview:
                    </div>
                    <Image
                      width={128}
                      height={128}
                      src={post.coverImage}
                      alt={post.title}
                      className="w-32 h-20 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder.svg";
                        target.className += " border-red-300";
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
