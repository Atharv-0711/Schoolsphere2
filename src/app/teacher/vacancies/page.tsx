import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  DollarSign,
  School,
  Calendar,
  Search,
  Filter,
} from "lucide-react";

export default async function TeacherVacancies() {
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

  // Fetch school vacancies
  // For now, we'll use mock data
  const mockVacancies = [
    {
      id: 1,
      school_name: "Greenwood High School",
      position: "Mathematics Teacher",
      grade_levels: "9-12",
      subjects: ["Mathematics", "Calculus"],
      location: "San Francisco, CA",
      salary: "$65,000 - $85,000",
      posted_date: "2023-07-15",
      application_deadline: "2023-08-15",
      description:
        "Seeking an experienced mathematics teacher for high school students. Must be proficient in teaching advanced calculus and algebra.",
    },
    {
      id: 2,
      school_name: "Riverside Elementary",
      position: "Science Teacher",
      grade_levels: "3-5",
      subjects: ["Science", "Environmental Studies"],
      location: "Portland, OR",
      salary: "$55,000 - $70,000",
      posted_date: "2023-07-10",
      application_deadline: "2023-08-10",
      description:
        "Looking for an enthusiastic science teacher who can make learning fun and engaging for elementary students.",
    },
    {
      id: 3,
      school_name: "Oakridge Academy",
      position: "English Literature Teacher",
      grade_levels: "6-8",
      subjects: ["English", "Literature"],
      location: "Austin, TX",
      salary: "$60,000 - $75,000",
      posted_date: "2023-07-05",
      application_deadline: "2023-08-05",
      description:
        "Seeking a passionate English teacher with experience in middle school education and a strong background in literature.",
    },
    {
      id: 4,
      school_name: "Tech Preparatory School",
      position: "Computer Science Teacher",
      grade_levels: "9-12",
      subjects: ["Computer Science", "Programming"],
      location: "Seattle, WA",
      salary: "$70,000 - $90,000",
      posted_date: "2023-07-01",
      application_deadline: "2023-08-01",
      description:
        "Looking for a computer science teacher with industry experience to teach programming and computer concepts to high school students.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">School Vacancies</h1>
          <p className="text-muted-foreground">
            Find teaching opportunities that match your qualifications
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-card rounded-lg border border-border p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label
                htmlFor="search"
                className="text-sm font-medium mb-1 block"
              >
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by position or school"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="location"
                className="text-sm font-medium mb-1 block"
              >
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="City, State or ZIP"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Vacancies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVacancies.map((vacancy) => (
            <Card
              key={vacancy.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{vacancy.position}</CardTitle>
                <CardDescription className="flex items-center">
                  <School className="h-4 w-4 mr-1" />
                  {vacancy.school_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{vacancy.location}</span>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{vacancy.salary}</span>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>
                      Deadline:{" "}
                      {new Date(
                        vacancy.application_deadline,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-muted-foreground line-clamp-2">
                      {vacancy.description}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" className="w-full mr-2">
                  View Details
                </Button>
                <Button className="w-full">Apply</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
