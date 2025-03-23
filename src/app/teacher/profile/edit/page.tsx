import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2 } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, Message } from "@/components/form-message";
import { UrlProvider } from "@/components/url-provider";

export default async function EditTeacherProfile(props: {
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

  // Get teacher profile
  const { data: teacherProfile } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!teacherProfile) {
    redirect("/teacher-profile");
  }

  // Get user details
  const { data: userDetails } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const updateTeacherProfileAction = async (formData: FormData) => {
    "use server";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    // Extract and process form data similar to saveTeacherProfileAction
    // Update the teacher profile in the database

    return redirect("/teacher/profile");
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 py-8 pt-24">
        <div className="w-full max-w-4xl rounded-lg border border-border bg-card p-6 shadow-sm">
          <UrlProvider>
            <form
              className="flex flex-col space-y-6"
              encType="multipart/form-data"
              action={updateTeacherProfileAction}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Edit Teacher Profile
                </h1>
                <p className="text-sm text-muted-foreground">
                  Update your professional information
                </p>
              </div>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="personal">
                    Personal Information
                  </TabsTrigger>
                  <TabsTrigger value="professional">
                    Professional Details
                  </TabsTrigger>
                  <TabsTrigger value="education">
                    Education & Skills
                  </TabsTrigger>
                  <TabsTrigger value="additional">
                    Additional Information
                  </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="full_name"
                        className="text-sm font-medium"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        defaultValue={
                          userDetails?.full_name ||
                          user.user_metadata?.full_name ||
                          ""
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user.email || ""}
                        readOnly
                        className="w-full bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={
                          teacherProfile.personal_information?.phone || ""
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        defaultValue={
                          teacherProfile.personal_information?.address || ""
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        defaultValue={
                          teacherProfile.personal_information?.city || ""
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">
                        State
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        defaultValue={
                          teacherProfile.personal_information?.state || ""
                        }
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Professional Details Tab */}
                <TabsContent value="professional" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="professional_summary"
                        className="text-sm font-medium"
                      >
                        Professional Summary
                      </Label>
                      <Textarea
                        id="professional_summary"
                        name="professional_summary"
                        defaultValue={teacherProfile.professional_summary || ""}
                        required
                        className="w-full min-h-[100px]"
                      />
                    </div>

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
                        defaultValue={teacherProfile.qualification || ""}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="experience"
                        className="text-sm font-medium"
                      >
                        Years of Experience
                      </Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        defaultValue={teacherProfile.experience || 0}
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
                        defaultValue={teacherProfile.subjects || ""}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="grade_levels"
                        className="text-sm font-medium"
                      >
                        Grade Levels
                      </Label>
                      <Input
                        id="grade_levels"
                        name="grade_levels"
                        type="text"
                        defaultValue={teacherProfile.grade_levels || ""}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Professional Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        defaultValue={teacherProfile.bio || ""}
                        required
                        className="w-full min-h-[100px]"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Education & Skills Tab */}
                <TabsContent value="education" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Educational Qualifications
                      </Label>
                      <div className="space-y-4" id="education-container">
                        {teacherProfile.educational_qualifications &&
                        teacherProfile.educational_qualifications.length > 0 ? (
                          teacherProfile.educational_qualifications.map(
                            (edu, index) => (
                              <div
                                key={index}
                                className="p-4 border rounded-md space-y-3"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`degree_${index}`}
                                      className="text-xs font-medium"
                                    >
                                      Degree/Certificate
                                    </Label>
                                    <Input
                                      id={`degree_${index}`}
                                      name={`education_degree_${index}`}
                                      type="text"
                                      defaultValue={edu.degree}
                                      required
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`institution_${index}`}
                                      className="text-xs font-medium"
                                    >
                                      Institution
                                    </Label>
                                    <Input
                                      id={`institution_${index}`}
                                      name={`education_institution_${index}`}
                                      type="text"
                                      defaultValue={edu.institution}
                                      required
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`year_${index}`}
                                      className="text-xs font-medium"
                                    >
                                      Year
                                    </Label>
                                    <Input
                                      id={`year_${index}`}
                                      name={`education_year_${index}`}
                                      type="text"
                                      defaultValue={edu.year}
                                      required
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`grade_${index}`}
                                      className="text-xs font-medium"
                                    >
                                      Grade/Percentage
                                    </Label>
                                    <Input
                                      id={`grade_${index}`}
                                      name={`education_grade_${index}`}
                                      type="text"
                                      defaultValue={edu.grade}
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                              </div>
                            ),
                          )
                        ) : (
                          <div className="p-4 border rounded-md space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label
                                  htmlFor="degree_0"
                                  className="text-xs font-medium"
                                >
                                  Degree/Certificate
                                </Label>
                                <Input
                                  id="degree_0"
                                  name="education_degree_0"
                                  type="text"
                                  placeholder="e.g. B.Ed"
                                  required
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  htmlFor="institution_0"
                                  className="text-xs font-medium"
                                >
                                  Institution
                                </Label>
                                <Input
                                  id="institution_0"
                                  name="education_institution_0"
                                  type="text"
                                  placeholder="e.g. Delhi University"
                                  required
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  htmlFor="year_0"
                                  className="text-xs font-medium"
                                >
                                  Year
                                </Label>
                                <Input
                                  id="year_0"
                                  name="education_year_0"
                                  type="text"
                                  placeholder="e.g. 2018"
                                  required
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  htmlFor="grade_0"
                                  className="text-xs font-medium"
                                >
                                  Grade/Percentage
                                </Label>
                                <Input
                                  id="grade_0"
                                  name="education_grade_0"
                                  type="text"
                                  placeholder="e.g. 85%"
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        type="hidden"
                        name="education_count"
                        value={
                          teacherProfile.educational_qualifications?.length || 1
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills" className="text-sm font-medium">
                        Skills
                      </Label>
                      <Textarea
                        id="skills"
                        name="skills"
                        defaultValue={teacherProfile.skills?.join(", ") || ""}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="teaching_methodologies"
                        className="text-sm font-medium"
                      >
                        Teaching Methodologies
                      </Label>
                      <Textarea
                        id="teaching_methodologies"
                        name="teaching_methodologies"
                        defaultValue={
                          teacherProfile.teaching_methodologies?.join(", ") ||
                          ""
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="classroom_management"
                        className="text-sm font-medium"
                      >
                        Classroom Management Strategies
                      </Label>
                      <Textarea
                        id="classroom_management"
                        name="classroom_management"
                        defaultValue={
                          teacherProfile.classroom_management_strategies?.join(
                            ", ",
                          ) || ""
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Additional Information Tab */}
                <TabsContent value="additional" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="lesson_planning"
                        className="text-sm font-medium"
                      >
                        Lesson Planning & Curriculum Development
                      </Label>
                      <Textarea
                        id="lesson_planning"
                        name="lesson_planning"
                        defaultValue={teacherProfile.lesson_planning || ""}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="tech_proficiency"
                        className="text-sm font-medium"
                      >
                        Technological Proficiency
                      </Label>
                      <Textarea
                        id="tech_proficiency"
                        name="tech_proficiency"
                        defaultValue={
                          teacherProfile.technological_proficiency?.join(
                            ", ",
                          ) || ""
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="research" className="text-sm font-medium">
                        Research & Publications
                      </Label>
                      <Textarea
                        id="research"
                        name="research"
                        defaultValue={
                          teacherProfile.research_publications
                            ?.map((p) => p.title)
                            .join("\n") || ""
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="workshops"
                        className="text-sm font-medium"
                      >
                        Workshops & Training Attended
                      </Label>
                      <Textarea
                        id="workshops"
                        name="workshops"
                        defaultValue={
                          teacherProfile.workshops_training
                            ?.map((w) => w.name)
                            .join("\n") || ""
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="extracurricular"
                        className="text-sm font-medium"
                      >
                        Extracurricular Activities Involvement
                      </Label>
                      <Textarea
                        id="extracurricular"
                        name="extracurricular"
                        defaultValue={
                          teacherProfile.extracurricular_activities?.join(
                            ", ",
                          ) || ""
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="awards" className="text-sm font-medium">
                        Awards & Recognitions
                      </Label>
                      <Textarea
                        id="awards"
                        name="awards"
                        defaultValue={
                          teacherProfile.awards_recognitions
                            ?.map((a) => a.title)
                            .join("\n") || ""
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="memberships"
                        className="text-sm font-medium"
                      >
                        Professional Memberships
                      </Label>
                      <Textarea
                        id="memberships"
                        name="memberships"
                        defaultValue={
                          teacherProfile.professional_memberships
                            ?.map((m) => m.organization)
                            .join("\n") || ""
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="references"
                        className="text-sm font-medium"
                      >
                        References
                      </Label>
                      <Textarea
                        id="references"
                        name="references"
                        defaultValue={
                          teacherProfile.references
                            ?.map((r) => r.details)
                            .join("\n") || ""
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume" className="text-sm font-medium">
                        Resume/CV (Optional)
                      </Label>
                      <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="w-full"
                      />
                      {teacherProfile.resume_url && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Current resume:{" "}
                          {teacherProfile.resume_url.split("/").pop()}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <a href="/teacher/profile">Cancel</a>
                </Button>
                <SubmitButton pendingText="Saving changes...">
                  Save Changes
                </SubmitButton>
              </div>

              <FormMessage message={searchParams} />
            </form>
          </UrlProvider>
        </div>
      </div>
    </>
  );
}
