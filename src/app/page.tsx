import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Users,
  ClipboardCheck,
  Calendar,
  BarChart4,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* User Roles Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Role-Based Experience</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Schoosphere provides tailored experiences for every user role in
              the educational ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <GraduationCap className="w-6 h-6" />,
                title: "For Students",
                description:
                  "Track grades, attendance, and assignments with visual progress indicators",
              },
              {
                icon: <ClipboardCheck className="w-6 h-6" />,
                title: "For Teachers",
                description:
                  "Manage attendance, resumes, and schedule parent meetings efficiently",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "For Parents",
                description:
                  "Monitor your child's performance and schedule teacher meetings",
              },
              {
                icon: <BarChart4 className="w-6 h-6" />,
                title: "For Administrators",
                description:
                  "Oversee school operations with comprehensive analytics",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how Schoosphere transforms educational management
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80"
                alt="Dashboard Interface"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Intuitive Dashboards</h3>
              <p className="text-gray-600 mb-6">
                Role-specific dashboards showing relevant information with
                clean, intuitive navigation. Get quick access to attendance
                charts, grade summaries, and upcoming meetings.
              </p>
              <ul className="space-y-2">
                {[
                  "Visual performance tracking",
                  "Attendance monitoring",
                  "Assignment management",
                  "Meeting scheduling",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="md:order-2 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"
                alt="Communication Platform"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="md:order-1">
              <h3 className="text-2xl font-bold mb-4">
                Seamless Communication
              </h3>
              <p className="text-gray-600 mb-6">
                Connect all stakeholders in the educational journey with our
                integrated communication platform. Schedule meetings, share
                updates, and collaborate effectively.
              </p>
              <ul className="space-y-2">
                {[
                  "Parent-teacher meeting scheduling",
                  "Secure messaging system",
                  "Announcement broadcasts",
                  "Document sharing",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Schools Using Schoosphere</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Reliability</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of educational institutions already using Schoosphere
            to streamline their operations.
          </p>
          <a
            href="/sign-up"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
