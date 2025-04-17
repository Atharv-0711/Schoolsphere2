import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Code,
  Lightbulb,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-gray-50 min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Schoosphere Features</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Discover the powerful features that make Schoosphere the leading
              platform for educational management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-blue-500" />
                  <CardTitle>Role-Based Access</CardTitle>
                </div>
                <CardDescription>
                  Tailored experiences for students, teachers, parents, and
                  administrators.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Each user type gets a customized dashboard with relevant
                  information and tools designed specifically for their needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-green-500" />
                  <CardTitle>Comprehensive Reporting</CardTitle>
                </div>
                <CardDescription>
                  Detailed analytics and progress tracking for all stakeholders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate and view reports on attendance, academic performance,
                  and other key metrics with intuitive visualizations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-purple-500" />
                  <CardTitle>Communication Tools</CardTitle>
                </div>
                <CardDescription>
                  Seamless messaging between teachers, students, and parents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built-in messaging system with notifications, file sharing,
                  and meeting scheduling capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-yellow-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-500" />
                  <CardTitle>Smart Attendance</CardTitle>
                </div>
                <CardDescription>
                  Effortless attendance tracking with powerful insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Mark attendance quickly and generate reports showing trends,
                  patterns, and potential issues.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-red-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-red-500" />
                  <CardTitle>Secure Data Management</CardTitle>
                </div>
                <CardDescription>
                  Enterprise-grade security for all educational data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Role-based permissions, encryption, and compliance with
                  educational data protection regulations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-indigo-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Code className="h-6 w-6 text-indigo-500" />
                  <CardTitle>API Integration</CardTitle>
                </div>
                <CardDescription>
                  Connect with other educational tools and systems.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Integrate with LMS platforms, student information systems, and
                  other educational technology.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Request a Demo
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
