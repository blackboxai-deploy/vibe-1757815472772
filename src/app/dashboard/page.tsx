"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { VideoPlayer } from "@/components/VideoPlayer";

interface VideoHistory {
  id: string;
  prompt: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  duration: number;
}

export default function DashboardPage() {
  const [videos, setVideos] = useState<VideoHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoHistory | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockVideos: VideoHistory[] = [
      {
        id: "1",
        prompt: "A serene mountain landscape with flowing water and morning mist",
        videoUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1c5dc7cb-aa9d-40b5-9152-265c6dd48a8e.png",
        thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d8c7c3a7-3ee8-4305-953d-b61f4dcf587d.png",
        createdAt: new Date().toISOString(),
        status: 'completed',
        duration: 15
      },
      {
        id: "2",
        prompt: "Futuristic cityscape with flying cars and neon lights",
        videoUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/14423ecc-15ea-4acd-ba38-7e2bb1f2adb3.png",
        thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/68301c69-1a14-474c-a233-dbb2f5c6a320.png",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        duration: 20
      },
      {
        id: "3",
        prompt: "Underwater coral reef with colorful marine life",
        videoUrl: "",
        thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/883c001f-6316-4e2c-ac2e-3750de52832b.png",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'processing',
        duration: 0
      }
    ];
    setVideos(mockVideos);
  }, []);

  const filteredVideos = videos.filter(video => 
    video.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Your Video Gallery
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage and view all your AI-generated videos
            </p>
          </div>
          <Link href="/generate">
            <Button size="lg">
              Create New Video
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search your videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {videos.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {videos.filter(v => v.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {videos.filter(v => v.status === 'processing').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.prompt}
                  className="w-full h-full object-cover"
                />
                {video.status === 'processing' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-sm font-medium">Processing...</div>
                  </div>
                )}
                {video.status === 'completed' && video.videoUrl && (
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center"
                  >
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[8px] border-l-gray-800 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </button>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm">
                    {video.prompt}
                  </h3>
                  {getStatusBadge(video.status)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(video.createdAt).toLocaleDateString()}
                  {video.duration > 0 && ` • ${video.duration}s`}
                </div>
                <div className="mt-3 flex space-x-2">
                  {video.status === 'completed' && video.videoUrl && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1">
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Share
                      </Button>
                    </>
                  )}
                  {video.status === 'failed' && (
                    <Button size="sm" variant="outline" className="w-full">
                      Retry
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-lg mb-4">
              No videos found
            </div>
            <Link href="/generate">
              <Button>
                Generate Your First Video
              </Button>
            </Link>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {selectedVideo.prompt}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedVideo(null)}
                >
                  Close
                </Button>
              </div>
              <div className="p-4">
                <VideoPlayer
                  videoUrl={selectedVideo.videoUrl}
                  title={selectedVideo.prompt}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}