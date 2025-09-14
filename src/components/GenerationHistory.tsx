"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoHistoryItem {
  id: string;
  prompt: string;
  thumbnailUrl: string;
  videoUrl?: string;
  status: 'completed' | 'processing' | 'failed';
  createdAt: string;
  duration: number;
}

interface GenerationHistoryProps {
  onVideoSelect?: (video: VideoHistoryItem) => void;
}

export function GenerationHistory({ onVideoSelect }: GenerationHistoryProps) {
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockHistory: VideoHistoryItem[] = [
      {
        id: "1",
        prompt: "Serene mountain landscape with flowing water",
        thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/695dffb3-2063-4f94-ae79-51b8939e6bf3.png",
        videoUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8a924dcc-92ae-4f6e-9437-0bdd93ea9d79.png",
        status: "completed",
        createdAt: new Date().toISOString(),
        duration: 15
      },
      {
        id: "2",
        prompt: "Futuristic cityscape at sunset",
        thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2270f072-1f3e-4ef4-a84c-f9a552bb648c.png",
        videoUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5e5fc153-fd7e-4b20-9056-c0ff39eba019.png",
        status: "completed",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        duration: 20
      },
      {
        id: "3",
        prompt: "Underwater coral reef exploration",
        thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/51e5f530-784d-4d56-90f3-8472c7a056d6.png",
        status: "processing",
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        duration: 0
      },
      {
        id: "4",
        prompt: "Time-lapse of blooming flowers",
        thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0f19889c-10fd-45f8-b71a-cf32ff3bc626.png",
        videoUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bff477cf-44bf-4e32-b169-ec13a2a9483d.png",
        status: "completed",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        duration: 10
      },
      {
        id: "5",
        prompt: "Northern lights dancing in the sky",
        thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bd4428e5-397f-40de-99da-a9f195fee970.png",
        status: "failed",
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        duration: 0
      }
    ];
    setHistory(mockHistory);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Recent Generations</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your video generation history
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="group border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => onVideoSelect?.(item)}
              >
                <div className="flex space-x-3">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.prompt}
                      className="w-16 h-10 object-cover rounded"
                    />
                    {item.status === 'processing' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {item.status === 'completed' && item.videoUrl && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                        <div className="w-4 h-4 bg-white/90 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[3px] border-l-gray-800 border-t-[2px] border-t-transparent border-b-[2px] border-b-transparent ml-0.5"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {item.prompt}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    </div>
                    {item.duration > 0 && (
                      <span className="text-xs text-gray-400">
                        {item.duration}s
                      </span>
                    )}
                  </div>
                </div>

                {item.status === 'failed' && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Retry Generation
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {history.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No videos generated yet</p>
                <p className="text-xs mt-1">Start creating to see your history</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" className="w-full" size="sm">
            View All Videos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}