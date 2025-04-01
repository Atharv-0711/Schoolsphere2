import DashboardNavbar from "@/components/dashboard-navbar";
import { InfoIcon, UserCircle, GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user's role from user metadata
  const userRole = user.user_metadata?.user_role || "student";

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Welcome to Schoosphere</h1>
            <div className="bg-blue-50 text-sm p-3 px-4 rounded-lg text-blue-700 flex gap-2 items-center border border-blue-100">
              <InfoIcon size="14" />
              <span>
                You are logged in as a <strong>{userRole}</strong>. This
                dashboard is customized for your role.
              </span>
            </div>
          </header>

          {/* User Profile Section */}
          <section className="bg-white rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <UserCircle size={48} className="text-blue-600" />
              <div>
                <h2 className="font-semibold text-xl">Your Profile</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">
                  Account Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Name:</span>{" "}
                    {user.user_metadata?.full_name || "Not provided"}
                  </p>
                  <p>
                    <span className="text-gray-500">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="text-gray-500">Role:</span> {userRole}
                  </p>
                  <p>
                    <span className="text-gray-500">Member since:</span>{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors flex flex-col items-center justify-center">
                    <GraduationCap className="h-5 w-5 mb-1" />
                    View Courses
                  </button>
                  <button className="p-3 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors flex flex-col items-center justify-center">
                    <InfoIcon className="h-5 w-5 mb-1" />
                    Help Center
                  </button>
                  {userRole === "teacher" && (
                    <a
                      href="/teacher/profile/edit"
                      className="p-3 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors flex flex-col items-center justify-center"
                    >
                      <UserCircle className="h-5 w-5 mb-1" />
                      Update Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Role-specific Dashboard Content */}
          <section className="bg-white rounded-xl p-6 border shadow-sm">
            <h2 className="font-semibold text-xl mb-4">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
            </h2>
            <p className="text-gray-500 mb-4">
              This section will be customized based on your role in the
              Schoosphere platform.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-blue-700">
                Your personalized dashboard is being set up.
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Check back soon for your role-specific features!
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
