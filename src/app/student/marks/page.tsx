import DashboardNavbar from "@/components/dashboard-navbar";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function StudentMarks() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user's role from user metadata
  const userRole = user.user_metadata?.user_role || "student";

  // Redirect if not a student
  if (userRole !== "student") {
    return redirect("/dashboard");
  }

  // Mock data for student marks
  const studentMarks = [
    { subject: "Mathematics", marks: 85, grade: "A", maxMarks: 100 },
    { subject: "Science", marks: 78, grade: "B+", maxMarks: 100 },
    { subject: "English", marks: 92, grade: "A+", maxMarks: 100 },
    { subject: "History", marks: 75, grade: "B", maxMarks: 100 },
    { subject: "Geography", marks: 88, grade: "A", maxMarks: 100 },
    { subject: "Computer Science", marks: 95, grade: "A+", maxMarks: 100 },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl font-bold">Academic Performance</h1>
            </div>
            <div className="bg-blue-50 text-sm p-3 px-4 rounded-lg text-blue-700 flex gap-2 items-center border border-blue-100">
              <BookOpen size={14} />
              <span>View your academic performance across all subjects.</span>
            </div>
          </header>

          {/* Marks Section */}
          <section className="bg-white rounded-xl p-6 border shadow-sm">
            <h2 className="font-semibold text-xl mb-6">Subject-wise Marks</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-3 font-medium text-gray-700">
                      Subject
                    </th>
                    <th className="text-center p-3 font-medium text-gray-700">
                      Marks Obtained
                    </th>
                    <th className="text-center p-3 font-medium text-gray-700">
                      Maximum Marks
                    </th>
                    <th className="text-center p-3 font-medium text-gray-700">
                      Percentage
                    </th>
                    <th className="text-center p-3 font-medium text-gray-700">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentMarks.map((subject, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{subject.subject}</td>
                      <td className="p-3 text-center">{subject.marks}</td>
                      <td className="p-3 text-center">{subject.maxMarks}</td>
                      <td className="p-3 text-center">
                        {((subject.marks / subject.maxMarks) * 100).toFixed(1)}%
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subject.grade.startsWith("A")
                              ? "bg-green-100 text-green-800"
                              : subject.grade.startsWith("B")
                                ? "bg-blue-100 text-blue-800"
                                : subject.grade.startsWith("C")
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subject.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">
                Performance Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-sm text-gray-500">Average Percentage</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(
                      studentMarks.reduce(
                        (acc, subject) =>
                          acc + (subject.marks / subject.maxMarks) * 100,
                        0,
                      ) / studentMarks.length
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-sm text-gray-500">Highest Marks</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.max(...studentMarks.map((subject) => subject.marks))}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-sm text-gray-500">Total Subjects</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {studentMarks.length}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
