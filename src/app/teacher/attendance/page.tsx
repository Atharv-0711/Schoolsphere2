import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import AttendanceClassClient from "@/components/AttendanceClassClient";

export default async function AttendancePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user's role from user metadata
  const userRole = user.user_metadata?.user_role || "student";

  if (userRole !== "teacher") {
    return redirect("/dashboard");
  }

  // Fetch classes taught by this teacher
  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("*")
    .eq("teacher_id", user.id);

  if (classesError) {
    console.error("Error fetching classes:", classesError);
  }

  // For demo purposes, if no classes exist, create a dummy class
  let dummyClass = null;
  if (!classes || classes.length === 0) {
    try {
      // This would normally be done through a proper class creation flow
      const { data: newClass, error: dummyClassError } = await supabase
        .from("classes")
        .insert({
          name: "Mathematics 101",
          grade_level: "Grade 9",
          teacher_id: user.id,
          school_year: "2023-2024",
        })
        .select()
        .single();

      if (dummyClassError) {
        console.error("Error creating dummy class:", dummyClassError);
      } else {
        dummyClass = newClass;
      }
    } catch (error) {
      console.error("Exception creating dummy class:", error);
    }
  }

  // Use either the fetched classes or the newly created dummy class
  const displayClasses =
    classes?.length > 0 ? classes : dummyClass ? [dummyClass] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">
            Today: {format(new Date(), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Previous Day
          </Button>
          <Button variant="outline" size="sm">
            Select Date
          </Button>
        </div>
      </div>

      {displayClasses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {displayClasses.map((classItem) => (
            <Card key={classItem.id} className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{classItem.name}</CardTitle>
                  <span className="text-sm text-gray-500">
                    {classItem.grade_level}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <AttendanceClassClient classId={classItem.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No classes found. Create a class to start marking attendance.
          </p>
          <Button className="mt-4">Create New Class</Button>
        </div>
      )}
    </div>
  );
}
