import { createClient } from "../../../supabase/server";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, Plus, Clock } from "lucide-react";
import Link from "next/link";

export default async function MeetingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get all meetings for the current user based on their role
  const isTeacher = user.user_metadata?.user_role === "teacher";
  const isParent = user.user_metadata?.user_role === "parent";

  let meetingsQuery = supabase.from("meetings").select(
    `*, 
    teacher:teacher_id(id, full_name, email), 
    parent:parent_id(id, full_name, email),
    student:student_id(id, full_name)`,
  );

  if (isTeacher) {
    meetingsQuery = meetingsQuery.eq("teacher_id", user.id);
  } else if (isParent) {
    meetingsQuery = meetingsQuery.eq("parent_id", user.id);
  }

  const { data: allMeetings } = await meetingsQuery.order("meeting_date", {
    ascending: true,
  });

  // Filter meetings into upcoming and past
  const now = new Date();
  const upcomingMeetings =
    allMeetings?.filter((meeting) => {
      const meetingDate = new Date(meeting.meeting_date);
      return (
        meetingDate >= now ||
        (meetingDate.getDate() === now.getDate() &&
          meetingDate.getMonth() === now.getMonth() &&
          meetingDate.getFullYear() === now.getFullYear())
      );
    }) || [];

  const pastMeetings =
    allMeetings?.filter((meeting) => {
      const meetingDate = new Date(meeting.meeting_date);
      return (
        meetingDate < now &&
        !(
          meetingDate.getDate() === now.getDate() &&
          meetingDate.getMonth() === now.getMonth() &&
          meetingDate.getFullYear() === now.getFullYear()
        )
      );
    }) || [];

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

  // Format meeting date for display
  const formatMeetingDate = (dateString: string) => {
    const meetingDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (
      meetingDate.getDate() === today.getDate() &&
      meetingDate.getMonth() === today.getMonth() &&
      meetingDate.getFullYear() === today.getFullYear()
    ) {
      return `Today at ${meetingDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (
      meetingDate.getDate() === tomorrow.getDate() &&
      meetingDate.getMonth() === tomorrow.getMonth() &&
      meetingDate.getFullYear() === tomorrow.getFullYear()
    ) {
      return `Tomorrow at ${meetingDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return meetingDate.toLocaleString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 py-8 pt-24">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">Meetings</h1>
            {isTeacher && (
              <Link href="/meetings/schedule">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </Link>
            )}
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming
                {upcomingMeetings.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {upcomingMeetings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <Link
                      key={meeting.id}
                      href={`/meetings/${meeting.id}`}
                      className="block"
                    >
                      <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {meeting.title}
                              </CardTitle>
                              <CardDescription>
                                {isTeacher
                                  ? `With: ${meeting.parent?.full_name || meeting.parent?.email || "Unknown parent"}`
                                  : `With: ${meeting.teacher?.full_name || meeting.teacher?.email || "Unknown teacher"}`}
                                {meeting.student &&
                                  ` - Regarding: ${meeting.student.full_name}`}
                              </CardDescription>
                            </div>
                            <div>{getStatusBadge(meeting.status)}</div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatMeetingDate(meeting.meeting_date)}
                            <Clock className="h-4 w-4 ml-4 mr-2" />
                            {meeting.duration_minutes} minutes
                          </div>
                          {meeting.meeting_link && (
                            <div className="flex items-center text-sm">
                              <Video className="h-4 w-4 mr-2 text-blue-500" />
                              <span className="text-blue-500">
                                Video meeting available
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No upcoming meetings
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {isTeacher
                      ? "Schedule a meeting with a parent to discuss student progress"
                      : "No teachers have scheduled meetings with you yet"}
                  </p>
                  {isTeacher && (
                    <Link href="/meetings/schedule">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {pastMeetings.length > 0 ? (
                <div className="space-y-4">
                  {pastMeetings.map((meeting) => (
                    <Link
                      key={meeting.id}
                      href={`/meetings/${meeting.id}`}
                      className="block"
                    >
                      <Card className="cursor-pointer hover:bg-accent/50 transition-colors opacity-80">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {meeting.title}
                              </CardTitle>
                              <CardDescription>
                                {isTeacher
                                  ? `With: ${meeting.parent?.full_name || meeting.parent?.email || "Unknown parent"}`
                                  : `With: ${meeting.teacher?.full_name || meeting.teacher?.email || "Unknown teacher"}`}
                                {meeting.student &&
                                  ` - Regarding: ${meeting.student.full_name}`}
                              </CardDescription>
                            </div>
                            <div>{getStatusBadge(meeting.status)}</div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(meeting.meeting_date).toLocaleString([], {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No past meetings</h3>
                  <p className="text-muted-foreground">
                    Your meeting history will appear here
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
