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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, Message } from "@/components/form-message";
import { UrlProvider } from "@/components/url-provider";
import { scheduleMeetingAction } from "@/app/actions";

export default async function ScheduleMeetingPage(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Only teachers can schedule meetings
  if (user.user_metadata?.user_role !== "teacher") {
    redirect("/meetings");
  }

  // Get all parents
  const { data: parents } = await supabase
    .from("users")
    .select("id, full_name, email")
    .eq("user_role", "parent")
    .order("full_name");

  // Get all students
  const { data: students } = await supabase
    .from("users")
    .select("id, full_name")
    .eq("user_role", "student")
    .order("full_name");

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 py-8 pt-24">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              Schedule a Meeting
            </h1>
            <p className="text-muted-foreground mt-1">
              Schedule a virtual parent-teacher meeting
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
              <CardDescription>
                Fill out the form below to schedule a meeting with a parent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UrlProvider>
                <form action={scheduleMeetingAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent_id">Parent</Label>
                    <select
                      id="parent_id"
                      name="parent_id"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select a parent</option>
                      {parents &&
                        parents.map((parent) => (
                          <option key={parent.id} value={parent.id}>
                            {parent.full_name || parent.email}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student_id">Student (Optional)</Label>
                    <select
                      id="student_id"
                      name="student_id"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a student</option>
                      {students &&
                        students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.full_name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Meeting Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Progress Discussion"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meeting_date">Date and Time</Label>
                      <Input
                        id="meeting_date"
                        name="meeting_date"
                        type="datetime-local"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration_minutes">
                        Duration (minutes)
                      </Label>
                      <select
                        id="duration_minutes"
                        name="duration_minutes"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="30"
                        required
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meeting_link">
                      Meeting Link (Optional)
                    </Label>
                    <Input
                      id="meeting_link"
                      name="meeting_link"
                      type="url"
                      placeholder="e.g. https://zoom.us/j/123456789"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Provide details about the meeting"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" asChild>
                      <a href="/meetings">Cancel</a>
                    </Button>
                    <SubmitButton pendingText="Scheduling...">
                      Schedule Meeting
                    </SubmitButton>
                  </div>

                  <FormMessage message={searchParams} />
                </form>
              </UrlProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
