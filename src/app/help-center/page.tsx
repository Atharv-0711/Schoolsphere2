import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  HelpCircle,
  MessageCircle,
  Video,
} from "lucide-react";

export default function HelpCenterPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-gray-50 min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Find answers to your questions and learn how to get the most out
              of Schoosphere.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <HelpCircle className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help articles..."
                className="pl-12 py-6 text-lg"
              />
              <Button className="absolute right-1.5 top-1.5">Search</Button>
            </div>
          </div>

          <Tabs defaultValue="faq" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="guides">User Guides</TabsTrigger>
              <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      question: "How do I reset my password?",
                      answer:
                        "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you instructions to reset your password.",
                    },
                    {
                      question: "How can I update my profile information?",
                      answer:
                        "You can update your profile information by navigating to your account settings. Click on your profile picture in the top right corner, select 'Settings', and then 'Edit Profile'.",
                    },
                    {
                      question: "Can I access Schoosphere on mobile devices?",
                      answer:
                        "Yes, Schoosphere is fully responsive and works on all mobile devices. You can access it through your mobile browser or download our mobile app from the App Store or Google Play.",
                    },
                    {
                      question: "How do I mark attendance for my class?",
                      answer:
                        "Teachers can mark attendance by navigating to the 'Attendance' section from their dashboard. Select the class, date, and mark each student as present or absent.",
                    },
                    {
                      question: "How can parents view their child's progress?",
                      answer:
                        "Parents can view their child's progress by logging into their parent account and selecting the child's profile. The dashboard will display attendance records, grades, and upcoming assignments.",
                    },
                    {
                      question: "Is my data secure on Schoosphere?",
                      answer:
                        "Yes, we take data security very seriously. All data is encrypted, and we comply with educational data protection regulations. We never share your data with third parties without your consent.",
                    },
                  ].map((faq, index) => (
                    <div
                      key={index}
                      className="border-b pb-4 last:border-0 last:pb-0"
                    >
                      <h3 className="font-semibold text-lg mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">User Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Getting Started Guide",
                      description:
                        "Learn the basics of Schoosphere and set up your account.",
                      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
                    },
                    {
                      title: "Teacher's Manual",
                      description:
                        "Comprehensive guide for teachers on using all features.",
                      icon: <FileText className="h-8 w-8 text-green-600" />,
                    },
                    {
                      title: "Parent's Guide",
                      description:
                        "How to monitor your child's progress and communicate with teachers.",
                      icon: <FileText className="h-8 w-8 text-purple-600" />,
                    },
                    {
                      title: "Administrator's Handbook",
                      description:
                        "Managing your school's Schoosphere implementation.",
                      icon: <FileText className="h-8 w-8 text-red-600" />,
                    },
                    {
                      title: "Student Quick Start",
                      description:
                        "Essential features for students to get started.",
                      icon: <BookOpen className="h-8 w-8 text-yellow-600" />,
                    },
                    {
                      title: "Advanced Features Guide",
                      description: "Detailed instructions for power users.",
                      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
                    },
                  ].map((guide, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start gap-4">
                          <div>{guide.icon}</div>
                          <div>
                            <CardTitle>{guide.title}</CardTitle>
                            <CardDescription>
                              {guide.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          View Guide
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Video Tutorials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Schoosphere Overview",
                      duration: "5:24",
                      thumbnail:
                        "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=800&q=80",
                    },
                    {
                      title: "Setting Up Your Profile",
                      duration: "3:45",
                      thumbnail:
                        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
                    },
                    {
                      title: "Marking Attendance",
                      duration: "4:12",
                      thumbnail:
                        "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
                    },
                    {
                      title: "Generating Reports",
                      duration: "6:08",
                      thumbnail:
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
                    },
                  ].map((video, index) => (
                    <div key={index} className="cursor-pointer group">
                      <div className="relative rounded-lg overflow-hidden mb-2">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                            <Video className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <h3 className="font-medium">{video.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
                    <p className="text-gray-600 mb-6">
                      Our support team is available to help you with any
                      questions or issues you may have.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Live Chat</h4>
                          <p className="text-sm text-gray-600">
                            Available Monday-Friday, 9am-5pm EST
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600 mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <div>
                          <h4 className="font-medium">Email Support</h4>
                          <p className="text-sm text-gray-600">
                            support@schoosphere.com
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600 mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <div>
                          <h4 className="font-medium">Phone Support</h4>
                          <p className="text-sm text-gray-600">
                            +1 (555) 123-4567
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Send a Message
                    </h3>
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-1"
                        >
                          Your Name
                        </label>
                        <Input id="name" placeholder="Enter your name" />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-1"
                        >
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium mb-1"
                        >
                          Subject
                        </label>
                        <Input id="subject" placeholder="Enter subject" />
                      </div>
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium mb-1"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter your message"
                        ></textarea>
                      </div>
                      <Button className="w-full">Send Message</Button>
                    </form>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
