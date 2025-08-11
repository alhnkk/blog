import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  FileText,
  MessageCircle,
  Eye,
  Calendar,
  Plus,
  Users,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Zap,
  Activity,
  Heart,
  BookOpen,
  Target,
  Award,
  Sparkles,
  Crown,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { getAllPosts } from "@/lib/actions/get-posts";
import { getAllComments } from "@/lib/actions/comment";
import { getCategories } from "@/lib/actions/category";
import { getAnalyticsStats } from "@/lib/actions/analytics";

async function DashboardStats() {
  const [postsResult, commentsResult, , analyticsStats] = await Promise.all([
    getAllPosts(),
    getAllComments(),
    getCategories(),
    getAnalyticsStats().catch(() => ({
      totalPageViews: 0,
      uniqueVisitors: 0,
      totalPostViews: 0,
      topPosts: [],
      recentEvents: [],
      dailyStats: [],
    })),
  ]);

  const posts = postsResult.success ? postsResult.data || [] : [];
  const comments = commentsResult.success ? commentsResult.data || [] : [];

  const publishedPosts = posts.filter((post) => post.status === "PUBLISHED");
  const draftPosts = posts.filter((post) => post.status === "DRAFT");
  const recentPosts = posts
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Toplam İçerik",
      value: posts.length,
      description: `${publishedPosts.length} yayında`,
      subDescription: `${draftPosts.length} taslak`,
      icon: BookOpen,
      color: "blue",
      change: "+12%",
      changeType: "positive" as const,
      progress: Math.round((publishedPosts.length / posts.length) * 100) || 0,
    },
    {
      title: "Görüntülenme",
      value: analyticsStats.totalPageViews,
      description: "Bu ay toplam",
      subDescription: "Tüm sayfalar",
      icon: Eye,
      color: "emerald",
      change: "+24%",
      changeType: "positive" as const,
      progress: 78,
    },
    {
      title: "Ziyaretçi",
      value: analyticsStats.uniqueVisitors,
      description: "Benzersiz kullanıcı",
      subDescription: "Son 30 gün",
      icon: Users,
      color: "violet",
      change: "+8%",
      changeType: "positive" as const,
      progress: 65,
    },
    {
      title: "Etkileşim",
      value: comments.length,
      description: "Toplam yorum",
      subDescription: "Aktif tartışma",
      icon: Heart,
      color: "rose",
      change: "+16%",
      changeType: "positive" as const,
      progress: 82,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-600",
        lightBg: "bg-blue-50 dark:bg-blue-950/20",
        border: "border-blue-200 dark:border-blue-800",
      },
      emerald: {
        bg: "bg-emerald-500",
        text: "text-emerald-600",
        lightBg: "bg-emerald-50 dark:bg-emerald-950/20",
        border: "border-emerald-200 dark:border-emerald-800",
      },
      violet: {
        bg: "bg-violet-500",
        text: "text-violet-600",
        lightBg: "bg-violet-50 dark:bg-violet-950/20",
        border: "border-violet-200 dark:border-violet-800",
      },
      rose: {
        bg: "bg-rose-500",
        text: "text-rose-600",
        lightBg: "bg-rose-50 dark:bg-rose-950/20",
        border: "border-rose-200 dark:border-rose-800",
      },
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <p className="text-slate-300 text-lg">
                  Blog yönetim merkezine hoş geldiniz
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-emerald-300">
                  Sistem Aktif
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30">
                <Clock className="w-3 h-3 text-blue-300" />
                <span className="text-sm font-medium text-blue-300">
                  {new Date().toLocaleDateString("tr-TR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="text-slate-400 text-sm">Son giriş</p>
              <p className="font-semibold text-white">
                {new Date().toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const colorClasses = getColorClasses(stat.color);
          return (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <div
                className={`absolute inset-0 ${colorClasses.lightBg} opacity-50`}
              />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl" />

              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {stat.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-3 ${colorClasses.bg} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-4">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {stat.subDescription}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      İlerleme
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {stat.progress}%
                    </span>
                  </div>
                  <Progress value={stat.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="relative overflow-hidden border-0 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-white dark:from-slate-950 dark:to-slate-900" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/20 to-transparent dark:from-blue-900/10 rounded-full blur-3xl" />

        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  Hızlı İşlemler
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  En sık kullanılan özellikler
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Hazır
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              asChild
              className="h-auto p-6 flex-col gap-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-lg hover:shadow-xl transition-all duration-300 group border-0"
            >
              <Link href="/admin/posts/new">
                <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-white">Yeni İçerik</span>
                  <p className="text-xs text-blue-100 mt-1">
                    Blog yazısı oluştur
                  </p>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex-col gap-3 border-2 hover:shadow-lg transition-all duration-300 group bg-white dark:bg-slate-800"
            >
              <Link href="/admin/posts">
                <div className="p-2 bg-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    İçerik Yönetimi
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Yazıları düzenle
                  </p>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex-col gap-3 border-2 hover:shadow-lg transition-all duration-300 group bg-white dark:bg-slate-800"
            >
              <Link href="/admin/comments">
                <div className="p-2 bg-violet-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Etkileşim
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Yorumları yönet
                  </p>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex-col gap-3 border-2 hover:shadow-lg transition-all duration-300 group bg-white dark:bg-slate-800"
            >
              <Link href="/admin/analytics">
                <div className="p-2 bg-rose-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Analytics
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    İstatistikleri gör
                  </p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900" />
            <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-emerald-100/30 to-transparent dark:from-emerald-900/10 rounded-full blur-3xl" />

            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                      Son İçerikler
                    </CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      En son oluşturulan yazılar
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                >
                  <Link href="/admin/posts" className="flex items-center gap-2">
                    <span>Tümünü Gör</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="relative">
              <div className="space-y-4">
                {recentPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      Henüz içerik bulunmuyor
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                      İlk blog yazınızı oluşturun
                    </p>
                  </div>
                ) : (
                  recentPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="group p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              #{index + 1}
                            </span>
                          </div>
                          <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-3">
                            <Badge
                              variant={
                                post.status === "PUBLISHED"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                post.status === "PUBLISHED"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                              }
                            >
                              {post.status === "PUBLISHED"
                                ? "🟢 Yayında"
                                : "🟡 Taslak"}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.createdAt).toLocaleDateString(
                                "tr-TR"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <Link href={`/admin/posts/${post.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sidebar Cards */}
        <div className="space-y-6">
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50" />

            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    Canlı Aktivite
                  </CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Son işlemler
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Yeni yazı yayınlandı
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      2 dakika önce
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      3 yeni yorum
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      15 dakika önce
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Taslak kaydedildi
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      1 saat önce
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card className="relative overflow-hidden border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50" />

            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl shadow-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    Performans Özeti
                  </CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bu hafta
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Okuma oranı
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    87%
                  </span>
                </div>
                <Progress value={87} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Etkileşim
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    92%
                  </span>
                </div>
                <Progress value={92} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    SEO Skoru
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    95%
                  </span>
                </div>
                <Progress value={95} className="h-2" />
              </div>

              <div className="pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Mükemmel performans!
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ContentLayout title="Dashboard">
      <DashboardStats />
    </ContentLayout>
  );
}
