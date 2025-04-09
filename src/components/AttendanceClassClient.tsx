"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle } from "lucide-react";

export default function AttendanceClassClient({
  classId,
}: {
  classId: string;
}) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);

      // Fetch students in this class
      const { data: classStudents, error: classStudentsError } = await supabase
        .from("class_students")
        .select("student_id")
        .eq("class_id", classId);

      if (classStudentsError) {
        console.error("Error fetching class students:", classStudentsError);
        setLoading(false);
        return;
      }

      if (!classStudents || classStudents.length === 0) {
        // For demo purposes, create dummy students
        // This would normally be done through a proper student enrollment flow
        const dummyStudentIds = [
          "550e8400-e29b-41d4-a716-446655440000",
          "550e8400-e29b-41d4-a716-446655440001",
          "550e8400-e29b-41d4-a716-446655440002",
        ];

        const dummyStudents = [
          {
            id: dummyStudentIds[0],
            full_name: "John Smith",
            email: "john@example.com",
          },
          {
            id: dummyStudentIds[1],
            full_name: "Sarah Johnson",
            email: "sarah@example.com",
          },
          {
            id: dummyStudentIds[2],
            full_name: "Michael Brown",
            email: "michael@example.com",
          },
        ];

        setStudents(dummyStudents);
        setLoading(false);
        return;
      }

      // Fetch student details
      const studentIds = classStudents.map((s) => s.student_id);
      const { data: studentDetails, error: studentDetailsError } =
        await supabase
          .from("users")
          .select("id, full_name, email")
          .in("id", studentIds);

      if (studentDetailsError) {
        console.error("Error fetching student details:", studentDetailsError);
      } else {
        setStudents(studentDetails || []);
      }

      // Fetch today's attendance records
      const today = new Date().toISOString().split("T")[0];
      const { data: attendanceRecords, error: attendanceError } = await supabase
        .from("attendance_records")
        .select("student_id, status")
        .eq("class_id", classId)
        .eq("date", today);

      if (attendanceError) {
        console.error("Error fetching attendance records:", attendanceError);
      } else if (attendanceRecords) {
        const attendanceMap: Record<string, string> = {};
        attendanceRecords.forEach((record) => {
          attendanceMap[record.student_id] = record.status;
        });
        setAttendance(attendanceMap);
      }

      setLoading(false);
    }

    fetchStudents();
  }, [classId, supabase]);

  const markAttendance = async (studentId: string, status: string) => {
    // Update local state immediately for responsive UI
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    setSaving(true);
    setSaveStatus("idle");

    const today = new Date().toISOString().split("T")[0];

    // Check if record already exists
    const { data: existingRecord, error: checkError } = await supabase
      .from("attendance_records")
      .select("id")
      .eq("class_id", classId)
      .eq("student_id", studentId)
      .eq("date", today)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing attendance:", checkError);
      setSaving(false);
      setSaveStatus("error");
      return;
    }

    let saveError;

    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from("attendance_records")
        .update({ status })
        .eq("id", existingRecord.id);

      saveError = error;
    } else {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSaving(false);
        setSaveStatus("error");
        return;
      }

      // Create new record
      const { error } = await supabase.from("attendance_records").insert({
        class_id: classId,
        student_id: studentId,
        date: today,
        status,
        marked_by: user.id,
      });

      saveError = error;
    }

    if (saveError) {
      console.error("Error saving attendance:", saveError);
      setSaveStatus("error");
    } else {
      setSaveStatus("success");
      // Reset success status after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
    }

    setSaving(false);
  };

  return (
    <div>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {students.length} students
            </span>
            <div className="flex items-center gap-2">
              {saveStatus === "success" && (
                <span className="text-green-600 text-sm">
                  Saved successfully
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-red-600 text-sm">Error saving</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newAttendance: Record<string, string> = {};
                  students.forEach((student) => {
                    newAttendance[student.id] = "present";
                  });

                  // Update local state
                  setAttendance(newAttendance);

                  // Save to database for each student
                  students.forEach((student) => {
                    markAttendance(student.id, "present");
                  });
                }}
              >
                Mark All Present
              </Button>
            </div>
          </div>

          <div className="divide-y">
            {students.map((student) => (
              <div
                key={student.id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{student.full_name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={
                      attendance[student.id] === "present"
                        ? "default"
                        : "outline"
                    }
                    className={
                      attendance[student.id] === "present" ? "bg-green-600" : ""
                    }
                    onClick={() => markAttendance(student.id, "present")}
                    disabled={saving}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      attendance[student.id] === "absent"
                        ? "default"
                        : "outline"
                    }
                    className={
                      attendance[student.id] === "absent" ? "bg-red-600" : ""
                    }
                    onClick={() => markAttendance(student.id, "absent")}
                    disabled={saving}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Absent
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
