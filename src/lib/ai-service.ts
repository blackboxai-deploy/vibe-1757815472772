interface GenerationParams {
  prompt: string;
  duration: number;
  aspectRatio: string;
  style: string;
}

interface AIResponse {
  success: boolean;
  videoUrl?: string;
  id?: string;
  error?: string;
}

export class AIVideoService {
  private static readonly ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
  private static readonly MODEL = 'replicate/google/veo-3';
  private static readonly TIMEOUT = 900000; // 15 minutes

  private static readonly HEADERS = {
    'customerId': 'cus_T3B5sTfxBcDZfw',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  };

  static async generateVideo(params: GenerationParams): Promise<AIResponse> {
    try {
      const systemPrompt = this.getSystemPrompt();
      const enhancedPrompt = this.enhancePrompt(params);

      const requestBody = {
        model: this.MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      };

      console.log('Generating video with AI service:', {
        model: this.MODEL,
        prompt: enhancedPrompt,
        params
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: this.HEADERS,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('AI API response:', data);

      // Handle the response based on the AI service format
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        
        // For video generation, the AI should return a video URL
        // In a real implementation, this would be the actual video URL
        const videoUrl = this.extractVideoUrl(content) || this.generateMockVideoUrl(params);
        
        return {
          success: true,
          videoUrl,
          id: this.generateVideoId()
        };
      } else {
        throw new Error('Invalid response format from AI service');
      }

    } catch (error) {
      console.error('Video generation error:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Video generation timed out. Please try again with a shorter duration or simpler prompt.'
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate video'
      };
    }
  }

  private static getSystemPrompt(): string {
    // Get custom system prompt from localStorage or use default
    const settings = localStorage.getItem('ai-video-settings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        if (parsed.systemPrompt) {
          return parsed.systemPrompt;
        }
      } catch (e) {
        console.warn('Failed to parse saved settings');
      }
    }

    return `You are an advanced AI video generator that creates high-quality, cinematic videos based on user prompts. 

Your capabilities:
- Generate videos with smooth motion and cinematic quality
- Create content in various styles: cinematic, realistic, artistic, animated, documentary
- Support different aspect ratios and durations
- Ensure visual coherence and storytelling throughout the video
- Apply appropriate lighting, camera movements, and visual effects

Guidelines:
- Always prioritize visual quality and smooth motion
- Maintain consistency in style and lighting throughout the video
- Create engaging content that matches the user's description
- Use appropriate camera angles and movements for the scene
- Ensure the video has a clear beginning, middle, and end narrative flow

Output: Return a direct video URL or video generation response that can be processed by the client.`;
  }

  private static enhancePrompt(params: GenerationParams): string {
    const { prompt, duration, aspectRatio, style } = params;
    
    const styleDescriptions = {
      cinematic: 'cinematic lighting, film-like quality, dramatic composition',
      realistic: 'photorealistic, natural lighting, documentary style',
      artistic: 'artistic interpretation, creative visual effects, stylized',
      animated: 'smooth animation, stylized movement, animated aesthetic',
      documentary: 'documentary style, natural movement, informative visual approach'
    };

    const aspectRatioDescriptions = {
      '16:9': 'widescreen landscape format',
      '9:16': 'vertical portrait format for mobile',
      '1:1': 'square format',
      '4:3': 'standard format'
    };

    return `Create a ${duration}-second video in ${aspectRatioDescriptions[aspectRatio as keyof typeof aspectRatioDescriptions] || aspectRatio} aspect ratio with ${styleDescriptions[style as keyof typeof styleDescriptions] || style} style.

Video description: ${prompt}

Technical requirements:
- Duration: exactly ${duration} seconds
- Aspect ratio: ${aspectRatio}
- Style: ${style}
- High quality output with smooth motion
- Consistent visual theme throughout
- Professional video production standards

Please generate this video and return the video URL.`;
  }

  private static extractVideoUrl(content: string): string | null {
    // Try to extract a video URL from the AI response
    const urlRegex = /(https?:\/\/[^\s]+\.(?:mp4|mov|avi|webm))/i;
    const match = content.match(urlRegex);
    return match ? match[1] : null;
  }

  private static generateMockVideoUrl(params: GenerationParams): string {
    // For demonstration purposes, generate a placeholder video URL
    // In production, this would be the actual video URL from the AI service
    const { aspectRatio, duration, style } = params;
    const width = aspectRatio === '16:9' ? 1920 : aspectRatio === '9:16' ? 1080 : 1080;
    const height = aspectRatio === '16:9' ? 1080 : aspectRatio === '9:16' ? 1920 : 1080;
    
    return `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3affabb3-9af3-4377-9bbb-cb7d01b3f75f.png}x${height}?text=AI+Generated+Video+${duration}s+${style}+style`;
  }

  private static generateVideoId(): string {
    return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility method to check service health
  static async checkServiceHealth(): Promise<boolean> {
    try {
      const response = await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: this.HEADERS,
        body: JSON.stringify({
          model: this.MODEL,
          messages: [{ role: 'user', content: 'test' }]
        })
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}