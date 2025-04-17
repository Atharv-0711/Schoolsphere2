import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, BookOpen, Clock, MapPin } from "lucide-react";

export default async function StudentCalendar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user's role from user metadata
  const userRole = user.user_metadata?.user_role || "student";

  // Redirect if not a student
  if (userRole !== "student") {
    return redirect("/dashboard");
  }

  // Mock calendar events - in a real app, this would come from the database
  const calendarEvents = [
    {
      id: 1,
      title: "Mathematics Test",
      date: "2023-07-15",
      time: "10:00 AM - 11:30 AM",
      location: "Room 101",
      type: "exam",
    },
    {
      id: 2,
      title: "Science Project Submission",
      date: "2023-07-20",
      time: "2:00 PM",
      location: "Science Lab",
      type: "assignment",
    },
    {
      id: 3,
      title: "Parent-Teacher Meeting",
      date: "2023-07-25",
      time: "4:00 PM - 6:00 PM",
      location: "School Auditorium",
      type: "meeting",
    },
    {
      id: 4,
      title: "Annual Sports Day",
      date: "2023-07-30",
      time: "9:00 AM - 4:00 PM",
      location: "School Grounds",
      type: "event",
    },
    {
      id: 5,
      title: "English Literature Class",
      date: "2023-07-18",
      time: "11:00 AM - 12:30 PM",
      location: "Room 205",
      type: "class",
    },
  ];

  // Group events by date for easier display
  const eventsByDate = calendarEvents.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">School Calendar</h1>
            <p className="text-gray-600">
              View upcoming events, classes, exams, and important dates
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Widget */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Calendar</h2>
                <div className="flex justify-center">
                  <Calendar mode="single" className="rounded-md border" />
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {calendarEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getEventTypeStyles(event.type)}`}
                        >
                          {capitalizeFirstLetter(event.type)}
                        </span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Helper functions
function getEventTypeStyles(type) {
  switch (type) {
    case "exam":
      return "bg-red-100 text-red-800";
    case "assignment":
      return "bg-yellow-100 text-yellow-800";
    case "meeting":
      return "bg-purple-100 text-purple-800";
    case "event":
      return "bg-green-100 text-green-800";
    case "class":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
