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
import { BookOpen, Clock, Calendar, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

export default async function ViewCoursesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Sample courses data - in a real app, this would come from the database
  const courses = [
    {
      id: "c1",
      title: "Mathematics 101",
      description:
        "Introduction to basic mathematical concepts and problem-solving techniques.",
      instructor: "Dr. Alan Smith",
      schedule: "Mon, Wed, Fri - 9:00 AM",
      duration: "1 hour",
      students: 28,
      progress: 65,
      category: "Mathematics",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    },
    {
      id: "c2",
      title: "English Literature",
      description:
        "Exploring classic and contemporary literary works and their cultural significance.",
      instructor: "Prof. Emily Johnson",
      schedule: "Tue, Thu - 11:00 AM",
      duration: "1.5 hours",
      students: 24,
      progress: 42,
      category: "Language Arts",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80",
    },
    {
      id: "c3",
      title: "Biology: Human Systems",
      description:
        "Comprehensive study of human body systems and their functions.",
      instructor: "Dr. Maria Rodriguez",
      schedule: "Mon, Wed - 1:00 PM",
      duration: "1.5 hours",
      students: 32,
      progress: 78,
      category: "Science",
      image:
        "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",
    },
    {
      id: "c4",
      title: "World History",
      description:
        "Exploring major historical events and their impact on modern society.",
      instructor: "Prof. James Wilson",
      schedule: "Tue, Thu - 2:00 PM",
      duration: "1 hour",
      students: 30,
      progress: 55,
      category: "Social Studies",
      image:
        "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=800&q=80",
    },
    {
      id: "c5",
      title: "Computer Science Fundamentals",
      description:
        "Introduction to programming concepts, algorithms, and computational thinking.",
      instructor: "Dr. Michael Chen",
      schedule: "Mon, Wed, Fri - 10:30 AM",
      duration: "1 hour",
      students: 26,
      progress: 60,
      category: "Technology",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
    {
      id: "c6",
      title: "Art & Design",
      description:
        "Exploring various art forms and developing creative skills through practical projects.",
      instructor: "Ms. Sophia Lee",
      schedule: "Fri - 1:00 PM",
      duration: "2 hours",
      students: 22,
      progress: 85,
      category: "Arts",
      image:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="w-full bg-gray-50 min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Courses</h1>
            <p className="text-gray-600">
              View and manage your enrolled courses, track progress, and access
              learning materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.instructor}</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {course.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{course.students} students enrolled</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
