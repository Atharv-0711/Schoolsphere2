import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { updateMeetingStatusAction } from "@/app/actions";
import { ArrowLeft, Calendar, Clock, Video, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function MeetingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get the meeting
  const { data: meeting } = await supabase
    .from("meetings")
    .select(
      `*, 
      teacher:teacher_id(id, full_name, email), 
      parent:parent_id(id, full_name, email),
      student:student_id(id, full_name)`,
    )
    .eq("id", params.id)
    .single();

  if (!meeting) {
    redirect("/meetings");
  }

  // Check if user is authorized to view this meeting
  if (meeting.teacher_id !== user.id && meeting.parent_id !== user.id) {
    redirect("/meetings");
  }

  const isTeacher = user.id === meeting.teacher_id;
  const meetingDate = new Date(meeting.meeting_date);
  const now = new Date();
  const isPastMeeting =
    meetingDate < now &&
    !(
      meetingDate.getDate() === now.getDate() &&
      meetingDate.getMonth() === now.getMonth() &&
      meetingDate.getFullYear() === now.getFullYear()
    );

  // Get meeting status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "confirmed":
        return <Badge variant="secondary">Confirmed</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 py-8 pt-24">
        <div className="w-full max-w-3xl">
          <div className="flex items-center mb-6">
            <Link href="/meetings" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Meeting Details
            </h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{meeting.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {isTeacher
                      ? `Meeting with ${meeting.parent?.full_name || meeting.parent?.email || "Unknown parent"}`
                      : `Meeting with ${meeting.teacher?.full_name || meeting.teacher?.email || "Unknown teacher"}`}
                    {meeting.student &&
                      ` regarding ${meeting.student.full_name}`}
                  </CardDescription>
                </div>
                <div>{getStatusBadge(meeting.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="font-medium">Date and Time:</span>
                  <span className="ml-2">
                    {meetingDate.toLocaleString([], {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-2">
                    {meeting.duration_minutes} minutes
                  </span>
                </div>
              </div>

              {meeting.description && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {meeting.description}
                  </p>
                </div>
              )}

              {meeting.meeting_link && (
                <div className="mt-4 p-4 border rounded-md bg-accent/50">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Video Meeting Link
                  </h3>
                  <a
                    href={meeting.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    {meeting.meeting_link}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Created{" "}
                {new Date(meeting.created_at || "").toLocaleString([], {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {!isPastMeeting && (
                <div className="flex space-x-2">
                  {isTeacher && meeting.status === "scheduled" && (
                    <form action={updateMeetingStatusAction}>
                      <input
                        type="hidden"
                        name="meeting_id"
                        value={meeting.id}
                      />
                      <input type="hidden" name="status" value="cancelled" />
                      <Button variant="destructive" size="sm" type="submit">
                        Cancel Meeting
                      </Button>
                    </form>
                  )}

                  {!isTeacher && meeting.status === "scheduled" && (
                    <form action={updateMeetingStatusAction}>
                      <input
                        type="hidden"
                        name="meeting_id"
                        value={meeting.id}
                      />
                      <input type="hidden" name="status" value="confirmed" />
                      <Button variant="default" size="sm" type="submit">
                        Confirm Attendance
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {isTeacher &&
                isPastMeeting &&
                meeting.status !== "completed" &&
                meeting.status !== "cancelled" && (
                  <form action={updateMeetingStatusAction}>
                    <input type="hidden" name="meeting_id" value={meeting.id} />
                    <input type="hidden" name="status" value="completed" />
                    <Button variant="outline" size="sm" type="submit">
                      Mark as Completed
                    </Button>
                  </form>
                )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
