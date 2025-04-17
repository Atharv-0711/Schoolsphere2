import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, GraduationCap, School, Users } from "lucide-react";

export default function SolutionsPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-gray-50 min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Schoosphere Solutions</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Tailored solutions for every educational stakeholder, designed to
              streamline processes and enhance learning outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="overflow-hidden">
              <div className="h-48 bg-blue-600 flex items-center justify-center">
                <School className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">For Schools</CardTitle>
                <CardDescription>
                  Comprehensive management solutions for educational
                  institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                    </div>
                    <span>Centralized administration dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                    </div>
                    <span>Teacher recruitment and management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                    </div>
                    <span>Student enrollment and performance tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                    </div>
                    <span>Curriculum and resource management</span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 bg-green-600 flex items-center justify-center">
                <GraduationCap className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">For Teachers</CardTitle>
                <CardDescription>
                  Tools to enhance teaching effectiveness and career growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-600"></div>
                    </div>
                    <span>Digital lesson planning and resource library</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-600"></div>
                    </div>
                    <span>Simplified attendance and grade management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-600"></div>
                    </div>
                    <span>Professional profile and career opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-600"></div>
                    </div>
                    <span>Parent-teacher communication tools</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 bg-purple-600 flex items-center justify-center">
                <Users className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">For Students</CardTitle>
                <CardDescription>
                  Engaging learning experiences and progress tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-purple-600"></div>
                    </div>
                    <span>Personalized learning dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-purple-600"></div>
                    </div>
                    <span>Assignment tracking and submission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-purple-600"></div>
                    </div>
                    <span>Performance analytics and feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-purple-600"></div>
                    </div>
                    <span>Resource library and study tools</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 bg-amber-600 flex items-center justify-center">
                <Building className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">For Parents</CardTitle>
                <CardDescription>
                  Stay connected with your child's educational journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-600"></div>
                    </div>
                    <span>Real-time progress monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-600"></div>
                    </div>
                    <span>Direct communication with teachers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-600"></div>
                    </div>
                    <span>Attendance and assignment notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-600"></div>
                    </div>
                    <span>School event calendar and reminders</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-amber-600 hover:bg-amber-700">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to transform your educational experience?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of schools, teachers, students, and parents who are
              already benefiting from Schoosphere's comprehensive solutions.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
