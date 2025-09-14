"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { VideoPlayer } from "./VideoPlayer";

interface GenerationStatus {
  status: 'idle' | 'generating' | 'completed' | 'error';
  progress: number;
  message: string;
  videoUrl?: string;
  videoId?: string;
}

export function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState([15]);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [style, setStyle] = useState("cinematic");
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt for your video");
      return;
    }

    setGenerationStatus({
      status: 'generating',
      progress: 0,
      message: 'Starting video generation...'
    });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          duration: duration[0],
          aspectRatio,
          style
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.videoUrl) {
        setGenerationStatus({
          status: 'completed',
          progress: 100,
          message: 'Video generated successfully!',
          videoUrl: data.videoUrl,
          videoId: data.id
        });
        toast.success("Video generated successfully!");
      } else {
        throw new Error(data.error || 'Failed to generate video');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationStatus({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'An error occurred'
      });
      toast.error("Failed to generate video. Please try again.");
    }
  };

  const handleDownload = () => {
    if (generationStatus.videoUrl) {
      const a = document.createElement('a');
      a.href = generationStatus.videoUrl;
      a.download = `ai-video-${generationStatus.videoId || Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Download started!");
    }
  };

  const handleNewGeneration = () => {
    setGenerationStatus({
      status: 'idle',
      progress: 0,
      message: ''
    });
  };

  const isGenerating = generationStatus.status === 'generating';
  const isCompleted = generationStatus.status === 'completed';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate AI Video</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Describe your video and watch AI bring it to life
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt Input */}
          <div>
            <Label htmlFor="prompt">Video Description *</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the video you want to create... (e.g., 'A serene mountain landscape with flowing water and morning mist, cinematic lighting, 4K quality')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] mt-2"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-1">
              Be descriptive and specific for best results
            </p>
          </div>

          {/* Generation Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Duration: {duration[0]} seconds</Label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                max={60}
                min={5}
                step={5}
                className="mt-2"
                disabled={isGenerating}
              />
            </div>
            
            <div>
              <Label>Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isGenerating}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Style</Label>
              <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="animated">Animated</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generation Status */}
          {generationStatus.status !== 'idle' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {generationStatus.message}
                </span>
                <span className="text-sm text-gray-500">
                  {generationStatus.progress}%
                </span>
              </div>
              <Progress value={generationStatus.progress} className="h-2" />
              
              {isGenerating && (
                <div className="text-xs text-gray-500 text-center">
                  This may take several minutes. Please don't close the page.
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isCompleted ? (
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  'Generate Video'
                )}
              </Button>
            ) : (
              <div className="flex gap-2 flex-1">
                <Button onClick={handleDownload} className="flex-1">
                  Download Video
                </Button>
                <Button onClick={handleNewGeneration} variant="outline" className="flex-1">
                  Generate New
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Preview */}
      {isCompleted && generationStatus.videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Video</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your AI-generated video is ready!
            </p>
          </CardHeader>
          <CardContent>
            <VideoPlayer
              videoUrl={generationStatus.videoUrl}
              title={prompt}
            />
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Prompt:</strong> {prompt}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <strong>Duration:</strong> {duration[0]}s • <strong>Aspect Ratio:</strong> {aspectRatio} • <strong>Style:</strong> {style}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}