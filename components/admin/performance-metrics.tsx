"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Database,
  Server,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PerformanceMetrics {
  responseTime: number;
  dbQueries: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  uptime: number;
  cacheHitRate: number;
}

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated performance metrics - in real app, this would come from monitoring service
    const fetchMetrics = () => {
      // Simulate API call delay
      setTimeout(() => {
        setMetrics({
          responseTime: Math.random() * 200 + 50, // 50-250ms
          dbQueries: Math.floor(Math.random() * 100) + 20,
          memoryUsage: Math.random() * 40 + 30, // 30-70%
          cpuUsage: Math.random() * 30 + 10, // 10-40%
          diskUsage: Math.random() * 20 + 60, // 60-80%
          uptime: Date.now() - Math.random() * 86400000 * 7, // Last 7 days
          cacheHitRate: Math.random() * 20 + 80, // 80-100%
        });
        setLoading(false);
      }, 1000);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}g ${hours}s`;
  };

  const getStatusColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good) return "text-green-600";
    if (value <= thresholds.warning) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good) return "bg-green-500";
    if (value <= thresholds.warning) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-2 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Response Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yanıt Süresi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getStatusColor(
                metrics.responseTime,
                { good: 100, warning: 200 }
              )}`}
            >
              {Math.round(metrics.responseTime)}ms
            </div>
            <Progress
              value={Math.min((metrics.responseTime / 300) * 100, 100)}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Database Queries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DB Sorguları</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dbQueries}</div>
            <p className="text-xs text-muted-foreground mt-1">Son 1 saatte</p>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bellek Kullanımı
            </CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getStatusColor(
                metrics.memoryUsage,
                { good: 50, warning: 75 }
              )}`}
            >
              {Math.round(metrics.memoryUsage)}%
            </div>
            <Progress value={metrics.memoryUsage} className="mt-2" />
          </CardContent>
        </Card>

        {/* CPU Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Kullanımı</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getStatusColor(
                metrics.cpuUsage,
                { good: 30, warning: 60 }
              )}`}
            >
              {Math.round(metrics.cpuUsage)}%
            </div>
            <Progress value={metrics.cpuUsage} className="mt-2" />
          </CardContent>
        </Card>

        {/* Disk Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Disk Kullanımı
            </CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getStatusColor(
                metrics.diskUsage,
                { good: 70, warning: 85 }
              )}`}
            >
              {Math.round(metrics.diskUsage)}%
            </div>
            <Progress value={metrics.diskUsage} className="mt-2" />
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Çalışma Süresi
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatUptime(metrics.uptime)}
            </div>
            <Badge variant="secondary" className="mt-2">
              Aktif
            </Badge>
          </CardContent>
        </Card>

        {/* Cache Hit Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Oranı</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(metrics.cacheHitRate)}%
            </div>
            <Progress value={metrics.cacheHitRate} className="mt-2" />
          </CardContent>
        </Card>

        {/* Overall Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistem Durumu</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Sağlıklı</div>
            <div className="flex space-x-1 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Performans Önerileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.responseTime > 200 && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">
                  Yanıt süresi yüksek. Database sorgularını optimize etmeyi
                  düşünün.
                </span>
              </div>
            )}

            {metrics.memoryUsage > 75 && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <MemoryStick className="h-4 w-4 text-red-600" />
                <span className="text-sm">
                  Bellek kullanımı kritik seviyede. Uygulamayı yeniden
                  başlatmayı düşünün.
                </span>
              </div>
            )}

            {metrics.cacheHitRate < 85 && (
              <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  Cache oranı düşük. Cache stratejinizi gözden geçirin.
                </span>
              </div>
            )}

            {metrics.responseTime <= 100 &&
              metrics.memoryUsage <= 50 &&
              metrics.cacheHitRate >= 90 && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Server className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    Sistem optimal performansta çalışıyor! 🎉
                  </span>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
