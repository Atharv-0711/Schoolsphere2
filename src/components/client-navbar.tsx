"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import UserProfile from "./user-profile";

export default function ClientNavbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { createBrowserClient } = await import("@supabase/ssr");
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <nav className="w-full border-b border-gray-200 bg-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" prefetch className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Schoosphere</span>
          </Link>
          <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">Schoosphere</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="#"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Solutions
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Resources
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            About
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button>Dashboard</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
