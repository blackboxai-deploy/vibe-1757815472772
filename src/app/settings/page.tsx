"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SettingsPage() {
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an AI video generator that creates high-quality, cinematic videos based on user prompts. Generate videos that are visually stunning, well-composed, and match the requested style and content. Focus on smooth motion, appropriate lighting, and engaging visual elements."
  );
  const [defaultDuration, setDefaultDuration] = useState([15]);
  const [defaultAspectRatio, setDefaultAspectRatio] = useState("16:9");
  const [autoDownload, setAutoDownload] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [maxConcurrentGenerations, setMaxConcurrentGenerations] = useState([3]);

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    localStorage.setItem('ai-video-settings', JSON.stringify({
      systemPrompt,
      defaultDuration: defaultDuration[0],
      defaultAspectRatio,
      autoDownload,
      emailNotifications,
      maxConcurrentGenerations: maxConcurrentGenerations[0]
    }));
    
    toast.success("Settings saved successfully!");
  };

  const handleResetDefaults = () => {
    setSystemPrompt(
      "You are an AI video generator that creates high-quality, cinematic videos based on user prompts. Generate videos that are visually stunning, well-composed, and match the requested style and content. Focus on smooth motion, appropriate lighting, and engaging visual elements."
    );
    setDefaultDuration([15]);
    setDefaultAspectRatio("16:9");
    setAutoDownload(false);
    setEmailNotifications(true);
    setMaxConcurrentGenerations([3]);
    
    toast.success("Settings reset to defaults!");
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Settings
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Customize your AI video generation experience and preferences
            </p>
          </div>

          <Tabs defaultValue="generation" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generation">Generation</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="generation" className="space-y-6">
              {/* AI System Prompt */}
              <Card>
                <CardHeader>
                  <CardTitle>AI System Prompt</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Customize the instructions given to the AI model for video generation
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea
                      id="system-prompt"
                      placeholder="Enter your custom system prompt..."
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      className="min-h-[120px] mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This prompt guides how the AI interprets and generates your videos
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Default Generation Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Default Generation Settings</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set default values for video generation parameters
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Default Duration: {defaultDuration[0]} seconds</Label>
                    <Slider
                      value={defaultDuration}
                      onValueChange={setDefaultDuration}
                      max={60}
                      min={5}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Default Aspect Ratio</Label>
                    <Select value={defaultAspectRatio} onValueChange={setDefaultAspectRatio}>
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
                    <Label>Max Concurrent Generations: {maxConcurrentGenerations[0]}</Label>
                    <Slider
                      value={maxConcurrentGenerations}
                      onValueChange={setMaxConcurrentGenerations}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Number of videos that can be generated simultaneously
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              {/* User Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>User Preferences</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure your app experience and behavior
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-download completed videos</Label>
                      <p className="text-xs text-gray-500">
                        Automatically download videos when generation completes
                      </p>
                    </div>
                    <Switch 
                      checked={autoDownload}
                      onCheckedChange={setAutoDownload}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email notifications</Label>
                      <p className="text-xs text-gray-500">
                        Receive email updates about video generation status
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* API Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Advanced settings for API behavior and performance
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>AI Model</Label>
                    <Input
                      value="replicate/google/veo-3"
                      readOnly
                      className="mt-2 bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Currently using Google's Veo-3 model via Replicate
                    </p>
                  </div>
                  
                  <div>
                    <Label>API Endpoint</Label>
                    <Input
                      value="https://oi-server.onrender.com/chat/completions"
                      readOnly
                      className="mt-2 bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Custom endpoint with no API keys required
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your account details and security
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Display Name</Label>
                    <Input
                      placeholder="Your display name"
                      className="mt-2"
                    />
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" className="mr-2">
                      Change Password
                    </Button>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Videos Generated</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">156</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Created</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleResetDefaults}>
              Reset to Defaults
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}