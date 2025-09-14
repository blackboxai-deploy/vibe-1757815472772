import { VideoGenerator } from "@/components/VideoGenerator";
import { GenerationHistory } from "@/components/GenerationHistory";

export default function GeneratePage() {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Video Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your creative ideas into stunning videos using advanced AI technology. 
            Simply describe what you want to see, and watch it come to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <VideoGenerator />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GenerationHistory />
          </div>
        </div>
      </div>
    </div>
  );
}