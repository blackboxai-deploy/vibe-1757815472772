import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            Generate Stunning{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Videos
            </span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300">
            Transform your ideas into captivating videos using cutting-edge AI technology. 
            Create professional-quality content in minutes, not hours.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/generate">
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Creating
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                View Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-white/50 dark:bg-slate-800/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Powerful AI Video Generation
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Advanced features to bring your creative vision to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI-Powered Generation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  State-of-the-art AI models create high-quality videos from simple text prompts
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 bg-green-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Real-time Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Watch your videos come to life with real-time generation progress and previews
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 bg-purple-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Full Control
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Customize every aspect with advanced settings and style controls
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ready to Create Amazing Videos?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Join thousands of creators who are already using AI to bring their stories to life
          </p>
          <div className="mt-8">
            <Link href="/generate">
              <Button size="lg" className="px-12 py-4 text-lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}