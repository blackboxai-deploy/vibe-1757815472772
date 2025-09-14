import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Video Generator",
  description: "Generate stunning videos with AI using advanced models",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800`}>
        <div className="flex flex-col h-full">
          <Navbar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}