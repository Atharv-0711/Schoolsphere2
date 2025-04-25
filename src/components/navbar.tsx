import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { GraduationCap, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

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
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/student/marks"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Marks
                </Link>
                <Link
                  href="/student/attendance"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Attendance
                </Link>
                <Link
                  href="/student/calendar"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Calendar
                </Link>
              </div>
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
