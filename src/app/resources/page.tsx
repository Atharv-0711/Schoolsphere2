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
import { BookOpen, FileText, Video } from "lucide-react";

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-gray-50 min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Educational Resources</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Access a wealth of educational materials, guides, and tools to
              enhance teaching and learning experiences.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="mb-2">
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Getting Started with Schoosphere</CardTitle>
                  <CardDescription>Video Tutorial Series</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    A comprehensive video series covering all aspects of the
                    Schoosphere platform for new users.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Watch Now
                  </Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="mb-2">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Teacher's Implementation Guide</CardTitle>
                  <CardDescription>PDF Guide</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Step-by-step instructions for teachers to maximize the
                    benefits of Schoosphere in their classrooms.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Download PDF
                  </Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="mb-2">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Best Practices for School Admins</CardTitle>
                  <CardDescription>Interactive Guide</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Learn how to effectively implement Schoosphere across your
                    entire school with this interactive guide.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Access Guide
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Resource Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Attendance Tracking Guide",
                  type: "PDF Guide",
                  category: "Teachers",
                },
                {
                  title: "Parent Portal Tutorial",
                  type: "Video",
                  category: "Parents",
                },
                {
                  title: "Student Dashboard Overview",
                  type: "Interactive Demo",
                  category: "Students",
                },
                {
                  title: "School Analytics Explained",
                  type: "Webinar",
                  category: "Administrators",
                },
                {
                  title: "Digital Lesson Planning",
                  type: "Template Pack",
                  category: "Teachers",
                },
                {
                  title: "Effective Parent-Teacher Meetings",
                  type: "Guide",
                  category: "Teachers & Parents",
                },
                {
                  title: "Student Progress Reporting",
                  type: "Tutorial",
                  category: "Teachers",
                },
                {
                  title: "School Year Planning",
                  type: "Toolkit",
                  category: "Administrators",
                },
              ].map((resource, index) => (
                <Card
                  key={index}
                  className="hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{resource.type}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                        {resource.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">View All Resources</Button>
            </div>
          </div>

          <div className="bg-blue-50 p-8 rounded-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Request Custom Resources</h2>
              <p className="text-gray-600 mt-2">
                Need specific educational materials for your institution? Our
                team can help create customized resources.
              </p>
            </div>
            <div className="flex justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Contact Resource Team
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
