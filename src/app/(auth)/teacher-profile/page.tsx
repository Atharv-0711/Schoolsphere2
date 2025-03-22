import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveTeacherProfileAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";

export default async function TeacherProfile(props: {
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

  // Check if user is a teacher
  if (user.user_metadata?.user_role !== "teacher") {
    redirect("/dashboard");
  }

  // Check if user already has a teacher profile
  const { data: teacherProfile } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (teacherProfile) {
    redirect("/teacher/vacancies");
  }

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm">
          <UrlProvider>
            <form
              className="flex flex-col space-y-6"
              encType="multipart/form-data"
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Teacher Profile Setup
                </h1>
                <p className="text-sm text-muted-foreground">
                  Please complete your profile to continue
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="qualification"
                    className="text-sm font-medium"
                  >
                    Highest Qualification
                  </Label>
                  <Input
                    id="qualification"
                    name="qualification"
                    type="text"
                    placeholder="e.g. Master's in Education"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium">
                    Years of Experience
                  </Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjects" className="text-sm font-medium">
                    Subjects
                  </Label>
                  <Input
                    id="subjects"
                    name="subjects"
                    type="text"
                    placeholder="e.g. Mathematics, Physics"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade_levels" className="text-sm font-medium">
                    Grade Levels
                  </Label>
                  <Input
                    id="grade_levels"
                    name="grade_levels"
                    type="text"
                    placeholder="e.g. 9-12"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Professional Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about your teaching philosophy and experience"
                    required
                    className="w-full min-h-[100px]"
                  />
                </div>
              </div>

              <SubmitButton
                formAction={saveTeacherProfileAction}
                pendingText="Saving profile..."
                className="w-full"
              >
                Save Profile & View Vacancies
              </SubmitButton>

              <FormMessage message={searchParams} />
            </form>
          </UrlProvider>
        </div>
      </div>
    </>
  );
}
