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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import Link from "next/link";

export default async function SchoolSelection() {
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

  // Check if user has a teacher profile
  const { data: teacherProfile } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!teacherProfile) {
    redirect("/teacher-profile");
  }

  // Get all schools
  const { data: schools } = await supabase.from("school_profiles").select("*");

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-start bg-background px-4 py-8 pt-24">
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              School Selection
            </h1>
            <p className="mt-2 text-muted-foreground">
              Are you already a member of a school or looking for opportunities?
            </p>
          </div>

          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">I'm already at a school</TabsTrigger>
              <TabsTrigger value="search">
                I'm looking for opportunities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select your current school</CardTitle>
                  <CardDescription>
                    Choose your school from the list below. If your school isn't
                    listed, you can select "None of these"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search schools..."
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                    {schools && schools.length > 0 ? (
                      schools.map((school) => (
                        <Card
                          key={school.id}
                          className="cursor-pointer hover:bg-accent/50 transition-colors"
                        >
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">
                              {school.school_name}
                            </CardTitle>
                            <CardDescription>{school.location}</CardDescription>
                          </CardHeader>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No schools found in the database
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">None of these</Button>
                  <Button disabled={!schools || schools.length === 0}>
                    Confirm Selection
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="search" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Find Teaching Opportunities</CardTitle>
                  <CardDescription>
                    Browse available teaching positions or search for specific
                    opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label htmlFor="location-filter">Location</Label>
                      <Input
                        id="location-filter"
                        placeholder="Any location"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject-filter">Subject</Label>
                      <Input
                        id="subject-filter"
                        placeholder="Any subject"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary-filter">Salary Range (₹)</Label>
                      <Input
                        id="salary-filter"
                        placeholder="Any range"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button className="w-full mb-6">
                    <Search className="mr-2 h-4 w-4" />
                    Search Vacancies
                  </Button>

                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      View all available teaching positions in our database
                    </p>
                    <Link href="/teacher/vacancies">
                      <Button variant="outline">Browse All Vacancies</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
