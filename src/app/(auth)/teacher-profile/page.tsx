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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

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
        <div className="w-full max-w-4xl rounded-lg border border-border bg-card p-6 shadow-sm">
          <UrlProvider>
            <form
              className="flex flex-col space-y-6"
              encType="multipart/form-data"
              action={saveTeacherProfileAction}
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Teacher Profile Setup
                </h1>
                <p className="text-sm text-muted-foreground">
                  Please complete your profile to continue
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
                        defaultValue={user.user_metadata?.full_name || ""}
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
                        placeholder="e.g. +91 9876543210"
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
                        placeholder="Your current address"
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
                        placeholder="Your city"
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
                        placeholder="Your state"
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
                        placeholder="Provide a brief summary of your professional background and teaching philosophy"
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
                        placeholder="e.g. Master's in Education"
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
                        placeholder="e.g. Mathematics, Physics (comma separated)"
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
                        placeholder="e.g. 9-12"
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
                        placeholder="Tell us about your teaching philosophy and experience"
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
                      </div>
                      <input type="hidden" name="education_count" value="1" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Teaching Certifications
                      </Label>
                      <div className="space-y-4" id="certification-container">
                        <div className="p-4 border rounded-md space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="cert_name_0"
                                className="text-xs font-medium"
                              >
                                Certification Name
                              </Label>
                              <Input
                                id="cert_name_0"
                                name="cert_name_0"
                                type="text"
                                placeholder="e.g. CTET"
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="cert_authority_0"
                                className="text-xs font-medium"
                              >
                                Issuing Authority
                              </Label>
                              <Input
                                id="cert_authority_0"
                                name="cert_authority_0"
                                type="text"
                                placeholder="e.g. CBSE"
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="cert_year_0"
                                className="text-xs font-medium"
                              >
                                Year
                              </Label>
                              <Input
                                id="cert_year_0"
                                name="cert_year_0"
                                type="text"
                                placeholder="e.g. 2019"
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <input
                        type="hidden"
                        name="certification_count"
                        value="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills" className="text-sm font-medium">
                        Skills
                      </Label>
                      <Textarea
                        id="skills"
                        name="skills"
                        placeholder="List your skills (comma separated)"
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
                        placeholder="Describe your teaching methodologies (comma separated)"
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
                        placeholder="Describe your classroom management strategies (comma separated)"
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
                        placeholder="Describe your approach to lesson planning and curriculum development"
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
                        placeholder="List technologies you're proficient with (comma separated)"
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
                        placeholder="List any research or publications (if any)"
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
                        placeholder="List workshops and training programs you've attended"
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
                        placeholder="Describe your involvement in extracurricular activities"
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
                        placeholder="List any awards or recognitions you've received"
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
                        placeholder="List any professional organizations you're a member of"
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
                        placeholder="Provide references (name, position, contact)"
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
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <SubmitButton pendingText="Saving profile..." className="w-full">
                Save Profile & Continue
              </SubmitButton>

              <FormMessage message={searchParams} />
            </form>
          </UrlProvider>
        </div>
      </div>
    </>
  );
}
