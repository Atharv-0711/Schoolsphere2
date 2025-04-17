import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import SchoolListComponent from "@/components/SchoolListComponent";

export default async function SchoolSelectionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is a teacher
  if (user.user_metadata?.user_role !== "teacher") {
    return redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <main className="w-full bg-gray-50 min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Connect with Schools</h1>
            <p className="text-gray-600">
              Browse available schools and their open positions. Apply to
              vacancies that match your qualifications and interests.
            </p>
          </div>

          <SchoolListComponent />
        </div>
      </main>
    </>
  );
}
