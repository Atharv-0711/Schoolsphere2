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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default async function TeacherProfileView() {
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

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 py-8 pt-24">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              Teacher Profile
            </h1>
            <Link href="/teacher/profile/edit">
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="md:col-span-1">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold mb-4">
                  {userDetails?.full_name?.charAt(0) ||
                    user.email?.charAt(0) ||
                    "T"}
                </div>
                <h2 className="text-xl font-semibold">
                  {userDetails?.full_name || "Teacher"}
                </h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-4 w-full">
                  <p className="text-sm font-medium">Experience</p>
                  <p>{teacherProfile.experience} years</p>
                </div>
                <div className="mt-2 w-full">
                  <p className="text-sm font-medium">Qualification</p>
                  <p>{teacherProfile.qualification}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <Tabs defaultValue="overview">
                <CardHeader>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="qualifications">
                      Qualifications
                    </TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">
                        Professional Summary
                      </h3>
                      <p className="mt-1 text-muted-foreground">
                        {teacherProfile.professional_summary ||
                          teacherProfile.bio}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Subjects</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {teacherProfile.subjects
                          .split(",")
                          .map((subject, index) => (
                            <Badge key={index} variant="secondary">
                              {subject.trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Grade Levels</h3>
                      <p className="mt-1">{teacherProfile.grade_levels}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="qualifications" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">
                        Educational Qualifications
                      </h3>
                      <div className="mt-2 space-y-3">
                        {teacherProfile.educational_qualifications &&
                        teacherProfile.educational_qualifications.length > 0 ? (
                          teacherProfile.educational_qualifications.map(
                            (edu, index) => (
                              <div
                                key={index}
                                className="p-3 border rounded-md"
                              >
                                <p className="font-medium">{edu.degree}</p>
                                <p className="text-sm text-muted-foreground">
                                  {edu.institution}, {edu.year}
                                </p>
                                {edu.grade && (
                                  <p className="text-sm">Grade: {edu.grade}</p>
                                )}
                              </div>
                            ),
                          )
                        ) : (
                          <p className="text-muted-foreground">
                            No educational qualifications added
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">
                        Teaching Certifications
                      </h3>
                      <div className="mt-2 space-y-3">
                        {teacherProfile.teaching_certifications &&
                        teacherProfile.teaching_certifications.length > 0 ? (
                          teacherProfile.teaching_certifications.map(
                            (cert, index) => (
                              <div
                                key={index}
                                className="p-3 border rounded-md"
                              >
                                <p className="font-medium">{cert.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {cert.authority}, {cert.year}
                                </p>
                              </div>
                            ),
                          )
                        ) : (
                          <p className="text-muted-foreground">
                            No teaching certifications added
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Work Experience</h3>
                      <div className="mt-2 space-y-3">
                        {teacherProfile.work_experience &&
                        teacherProfile.work_experience.length > 0 ? (
                          teacherProfile.work_experience.map((exp, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <p className="font-medium">{exp.position}</p>
                              <p className="text-sm">{exp.institution}</p>
                              <p className="text-sm text-muted-foreground">
                                {exp.start_year} - {exp.end_year || "Present"}
                              </p>
                              {exp.description && (
                                <p className="text-sm mt-1">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">
                            No work experience added
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">
                        Workshops & Training
                      </h3>
                      <div className="mt-2">
                        {teacherProfile.workshops_training &&
                        teacherProfile.workshops_training.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {teacherProfile.workshops_training.map(
                              (workshop, index) => (
                                <li key={index}>{workshop.name}</li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">
                            No workshops or training added
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {teacherProfile.skills &&
                        teacherProfile.skills.length > 0 ? (
                          teacherProfile.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">
                            No skills added
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">
                        Teaching Methodologies
                      </h3>
                      <div className="mt-2">
                        {teacherProfile.teaching_methodologies &&
                        teacherProfile.teaching_methodologies.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {teacherProfile.teaching_methodologies.map(
                              (method, index) => (
                                <li key={index}>{method}</li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">
                            No teaching methodologies added
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">
                        Classroom Management Strategies
                      </h3>
                      <div className="mt-2">
                        {teacherProfile.classroom_management_strategies &&
                        teacherProfile.classroom_management_strategies.length >
                          0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {teacherProfile.classroom_management_strategies.map(
                              (strategy, index) => (
                                <li key={index}>{strategy}</li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">
                            No classroom management strategies added
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resume & Documents</CardTitle>
              <CardDescription>
                Manage your resume and other professional documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Resume/CV</p>
                  <p className="text-sm text-muted-foreground">
                    {teacherProfile.resume_url
                      ? "Last updated on " +
                        new Date(
                          teacherProfile.updated_at ||
                            teacherProfile.created_at,
                        ).toLocaleDateString()
                      : "No resume uploaded yet"}
                  </p>
                </div>
                <Button variant="outline">
                  {teacherProfile.resume_url
                    ? "Update Resume"
                    : "Upload Resume"}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Keep your resume updated to improve your chances of finding the
                right teaching position.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
