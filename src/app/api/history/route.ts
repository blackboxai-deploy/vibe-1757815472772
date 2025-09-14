import { NextRequest, NextResponse } from 'next/server';

interface VideoHistory {
  id: string;
  prompt: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  duration: number;
  aspectRatio: string;
  style: string;
}

// In a real application, this would be stored in a database
// For demo purposes, we'll use a simple in-memory store
let videoHistory: VideoHistory[] = [
  {
    id: 'demo_1',
    prompt: 'A serene mountain landscape with flowing water and morning mist',
    videoUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cfc8ddde-17c2-4bdf-9e88-bbbebc632781.png',
    thumbnailUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ef195c77-a045-4185-a81d-16dbff4e82f0.png',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'completed',
    duration: 15,
    aspectRatio: '16:9',
    style: 'cinematic'
  },
  {
    id: 'demo_2',
    prompt: 'Futuristic cityscape with flying cars and neon lights at night',
    videoUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/934916fd-957e-4b85-b0ba-a0dbd10a34ae.png',
    thumbnailUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cc060ede-71ea-4cb8-b403-edbb1753554c.png',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'completed',
    duration: 20,
    aspectRatio: '16:9',
    style: 'cinematic'
  },
  {
    id: 'demo_3',
    prompt: 'Underwater coral reef with colorful marine life swimming',
    videoUrl: '',
    thumbnailUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/918c4693-dd78-4c95-9066-7cc20d568a5b.png',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: 'processing',
    duration: 0,
    aspectRatio: '16:9',
    style: 'realistic'
  }
];

// GET - Retrieve video history
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status');

    let filteredHistory = [...videoHistory];

    // Filter by status if provided
    if (status && ['completed', 'processing', 'failed'].includes(status)) {
      filteredHistory = filteredHistory.filter(video => video.status === status);
    }

    // Sort by creation date (newest first)
    filteredHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const paginatedHistory = filteredHistory.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedHistory,
      total: filteredHistory.length,
      limit,
      offset,
      hasMore: offset + limit < filteredHistory.length
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video history' },
      { status: 500 }
    );
  }
}

// POST - Add new video to history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, videoUrl, thumbnailUrl, duration, aspectRatio, style, status = 'completed' } = body;

    if (!prompt || !videoUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: prompt and videoUrl' },
        { status: 400 }
      );
    }

    const newVideo: VideoHistory = {
      id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      prompt: prompt.trim(),
      videoUrl,
      thumbnailUrl: thumbnailUrl || generateThumbnailUrl(prompt),
      createdAt: new Date().toISOString(),
      status,
      duration: duration || 0,
      aspectRatio: aspectRatio || '16:9',
      style: style || 'cinematic'
    };

    videoHistory.unshift(newVideo); // Add to beginning of array

    // Keep only the last 100 videos in memory (in a real app, this would be handled by the database)
    if (videoHistory.length > 100) {
      videoHistory = videoHistory.slice(0, 100);
    }

    return NextResponse.json({
      success: true,
      data: newVideo
    });

  } catch (error) {
    console.error('Error adding video to history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add video to history' },
      { status: 500 }
    );
  }
}

// PUT - Update video status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, videoUrl, thumbnailUrl } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: id and status' },
        { status: 400 }
      );
    }

    const videoIndex = videoHistory.findIndex(video => video.id === id);
    
    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    // Update the video
    videoHistory[videoIndex] = {
      ...videoHistory[videoIndex],
      status,
      ...(videoUrl && { videoUrl }),
      ...(thumbnailUrl && { thumbnailUrl })
    };

    return NextResponse.json({
      success: true,
      data: videoHistory[videoIndex]
    });

  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE - Remove video from history
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    const videoIndex = videoHistory.findIndex(video => video.id === id);
    
    if (videoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    // Remove the video
    const deletedVideo = videoHistory.splice(videoIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully',
      data: deletedVideo
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}

function generateThumbnailUrl(prompt: string): string {
  const encodedPrompt = encodeURIComponent(prompt.substring(0, 50));
  return `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f9ed1702-9928-4fff-b840-160ad5b437c1.png}`;
}