import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-gray-50 min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-4">About Schoosphere</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Transforming education through innovative technology and
              collaborative solutions.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">
                Our Mission
              </h2>
              <p className="text-gray-700 mb-4">
                To empower educational institutions, teachers, students, and
                parents with technology that enhances learning outcomes and
                simplifies administrative processes.
              </p>
              <p className="text-gray-700">
                We believe that by connecting all stakeholders in the
                educational ecosystem, we can create more effective and engaging
                learning environments.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-green-600">
                Our Vision
              </h2>
              <p className="text-gray-700 mb-4">
                A world where technology seamlessly supports education, allowing
                teachers to focus on teaching, students to focus on learning,
                and administrators to make data-driven decisions.
              </p>
              <p className="text-gray-700">
                We envision Schoosphere as the central hub that connects all
                aspects of educational management and communication.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <p className="text-gray-700 mb-4">
                    Schoosphere was founded in 2020 by a team of educators and
                    technologists who recognized the need for a comprehensive
                    platform that could address the unique challenges faced by
                    schools in the digital age.
                  </p>
                  <p className="text-gray-700 mb-4">
                    What began as a simple attendance tracking tool has evolved
                    into a full-featured educational management system used by
                    thousands of schools worldwide.
                  </p>
                  <p className="text-gray-700">
                    Our team combines expertise in education, software
                    development, and user experience design to create solutions
                    that are both powerful and intuitive.
                  </p>
                </div>
                <div className="md:w-1/2 relative h-64 md:h-80 rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                    alt="Team collaborating"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Our Leadership Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "CEO & Co-Founder",
                  bio: "Former school principal with 15 years of experience in education administration.",
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                },
                {
                  name: "Michael Chen",
                  role: "CTO & Co-Founder",
                  bio: "Software engineer with a passion for EdTech and improving educational outcomes.",
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
                },
                {
                  name: "Priya Patel",
                  role: "Chief Education Officer",
                  bio: "Curriculum development specialist with experience in both public and private education.",
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
                },
                {
                  name: "James Wilson",
                  role: "Head of Product",
                  bio: "UX specialist focused on creating intuitive experiences for educational software.",
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
                },
                {
                  name: "Maria Rodriguez",
                  role: "Director of Customer Success",
                  bio: "Former teacher dedicated to helping schools implement technology effectively.",
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
                },
                {
                  name: "David Kim",
                  role: "Chief Marketing Officer",
                  bio: "Marketing strategist with a background in educational publishing and EdTech.",
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-blue-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-blue-600 mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-blue-50 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Interested in learning more about Schoosphere? We'd love to hear
              from you and discuss how we can help your educational institution.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Contact Us
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
