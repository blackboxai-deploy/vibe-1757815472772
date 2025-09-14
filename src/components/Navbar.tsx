"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Generate", href: "/generate" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                VideoAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Sign Up
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span className="sr-only">Open main menu</span>
                  <div className="w-6 h-6 flex flex-col justify-center items-center">
                    <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></div>
                    <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></div>
                    <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300"></div>
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                      <Button className="w-full">
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}