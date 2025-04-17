import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react";

export default async function StudentAttendance() {
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

  // Mock attendance data - in a real app, this would come from the database
  const attendanceData = [
    {
      subject: "Mathematics",
      totalClasses: 20,
      attended: 18,
      percentage: 90,
      lastUpdated: "2023-07-15",
      records: [
        { date: "2023-07-01", status: "present" },
        { date: "2023-07-03", status: "present" },
        { date: "2023-07-05", status: "present" },
        { date: "2023-07-08", status: "absent" },
        { date: "2023-07-10", status: "present" },
        { date: "2023-07-12", status: "present" },
        { date: "2023-07-15", status: "present" },
      ],
    },
    {
      subject: "Science",
      totalClasses: 18,
      attended: 16,
      percentage: 89,
      lastUpdated: "2023-07-14",
      records: [
        { date: "2023-07-02", status: "present" },
        { date: "2023-07-04", status: "present" },
        { date: "2023-07-06", status: "absent" },
        { date: "2023-07-09", status: "present" },
        { date: "2023-07-11", status: "present" },
        { date: "2023-07-13", status: "present" },
        { date: "2023-07-14", status: "present" },
      ],
    },
    {
      subject: "English",
      totalClasses: 15,
      attended: 15,
      percentage: 100,
      lastUpdated: "2023-07-13",
      records: [
        { date: "2023-07-01", status: "present" },
        { date: "2023-07-04", status: "present" },
        { date: "2023-07-07", status: "present" },
        { date: "2023-07-10", status: "present" },
        { date: "2023-07-13", status: "present" },
      ],
    },
    {
      subject: "History",
      totalClasses: 12,
      attended: 10,
      percentage: 83,
      lastUpdated: "2023-07-12",
      records: [
        { date: "2023-07-02", status: "present" },
        { date: "2023-07-05", status: "absent" },
        { date: "2023-07-08", status: "present" },
        { date: "2023-07-11", status: "absent" },
        { date: "2023-07-12", status: "present" },
      ],
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Attendance Records</h1>
            <p className="text-gray-600">
              View your attendance records for all subjects
            </p>
          </header>

          {/* Attendance Summary */}
          <div className="bg-white rounded-xl p-6 border shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Attendance Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {attendanceData.map((subject) => (
                <div
                  key={subject.subject}
                  className="bg-gray-50 p-4 rounded-lg border"
                >
                  <h3 className="font-medium text-lg mb-2">
                    {subject.subject}
                  </h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Attendance:</span>
                    <span
                      className={`font-medium ${subject.percentage >= 85 ? "text-green-600" : subject.percentage >= 75 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {subject.percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Classes Attended:</span>
                    <span>
                      {subject.attended}/{subject.totalClasses}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Updated:</span>
                    <span>{subject.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Attendance Records */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Detailed Records</h2>

            {attendanceData.map((subject) => (
              <div key={subject.subject} className="mb-8">
                <h3 className="font-medium text-lg mb-3 border-b pb-2">
                  {subject.subject}
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left">Date</th>
                        <th className="py-2 px-4 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subject.records.map((record, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="py-2 px-4 flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                            {record.date}
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex items-center">
                              {record.status === "present" ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  <span className="text-green-600">
                                    Present
                                  </span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                  <span className="text-red-600">Absent</span>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
