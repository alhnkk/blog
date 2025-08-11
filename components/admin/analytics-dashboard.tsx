"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  ExternalLink,
  Activity,
} from "lucide-react";
import { AnalyticsStats, PostAnalytics, UserActivity } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import Link from "next/link";

interface AnalyticsDashboardProps {
  stats: AnalyticsStats;
}

export function AnalyticsDashboard({ stats }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Sayfa Görüntüleme
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPageViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Benzersiz Ziyaretçi
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.uniqueVisitors.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Yazı Görüntüleme
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPostViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ortalama Görüntüleme
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPostViews > 0 && stats.topPosts.length > 0
                ? Math.round(stats.totalPostViews / stats.topPosts.length)
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="posts">Popüler Yazılar</TabsTrigger>
          <TabsTrigger value="activity">Son Aktiviteler</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Son 30 Gün İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.dailyStats.length > 0 ? (
                <div className="space-y-2">
                  {stats.dailyStats.slice(0, 7).map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(stat.date).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">
                          {stat.views} görüntüleme
                        </Badge>
                        <Badge variant="outline">
                          {stat.unique_visitors} ziyaretçi
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Henüz veri bulunmuyor.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>En Çok Görüntülenen Yazılar</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topPosts.length > 0 ? (
                <div className="space-y-3">
                  {stats.topPosts.map((postStat, index) => (
                    <div
                      key={postStat.postId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant="secondary"
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          {index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-medium">
                            {postStat.post?.title || "Bilinmeyen Yazı"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {postStat._count.id} görüntüleme
                          </p>
                        </div>
                      </div>
                      {postStat.post?.slug && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/posts/${postStat.post.slug}`}
                            target="_blank"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Henüz görüntülenen yazı bulunmuyor.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentEvents.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentEvents.slice(0, 10).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{event.event}</Badge>
                            {event.user && (
                              <span className="text-sm text-muted-foreground">
                                {event.user.name}
                              </span>
                            )}
                          </div>
                          {event.path && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.path}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(event.createdAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Henüz aktivite bulunmuyor.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
