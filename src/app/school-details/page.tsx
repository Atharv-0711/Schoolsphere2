import { saveSchoolDetailsAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

interface SchoolDetailsProps {
  searchParams: Promise<Message>;
}

export default async function SchoolDetailsPage({
  searchParams,
}: SchoolDetailsProps) {
  const message = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is an admin
  const userRole = user.user_metadata?.user_role || "";
  if (userRole !== "admin") {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <form
          className="flex flex-col space-y-6"
          action={saveSchoolDetailsAction}
        >
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              School Details
            </h1>
            <p className="text-sm text-muted-foreground">
              Please provide information about your school
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school_name" className="text-sm font-medium">
                School Name
              </Label>
              <Input
                id="school_name"
                name="school_name"
                type="text"
                placeholder="Enter school name"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                School Location
              </Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="City, State"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher_count" className="text-sm font-medium">
                Number of Teachers
              </Label>
              <Input
                id="teacher_count"
                name="teacher_count"
                type="number"
                min="1"
                placeholder="e.g. 25"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student_count" className="text-sm font-medium">
                Number of Students
              </Label>
              <Input
                id="student_count"
                name="student_count"
                type="number"
                min="1"
                placeholder="e.g. 500"
                required
                className="w-full"
              />
            </div>
          </div>

          <SubmitButton className="w-full" pendingText="Saving...">
            Save School Details
          </SubmitButton>

          <FormMessage message={message} />
        </form>
      </div>
    </div>
  );
}
