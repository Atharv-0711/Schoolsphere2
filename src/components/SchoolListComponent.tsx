"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

type School = {
  id: string;
  name: string;
  location: string;
  image_url: string;
  vacancies: SchoolVacancy[];
};

type SchoolVacancy = {
  id: string;
  position: string;
  subjects: string;
  grade_levels: string;
  experience_required?: number;
  description: string;
  salary_range: string;
  application_deadline: string;
};

export default function SchoolListComponent() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // For now, we'll use dummy data since we don't have the actual schools table
        // This would be replaced with actual Supabase queries
        const dummySchools: School[] = [
          {
            id: "1",
            name: "Greenfield Academy",
            location: "New York, NY",
            image_url:
              "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
            vacancies: [
              {
                id: "v1",
                position: "Math Teacher",
                subjects: "Mathematics, Algebra",
                grade_levels: "9-12",
                experience_required: 3,
                description:
                  "Looking for an experienced math teacher for high school students.",
                salary_range: "$60,000 - $75,000",
                application_deadline: "2023-12-31",
              },
              {
                id: "v2",
                position: "Science Teacher",
                subjects: "Biology, Chemistry",
                grade_levels: "9-12",
                experience_required: 2,
                description:
                  "Science teacher needed for high school biology and chemistry classes.",
                salary_range: "$55,000 - $70,000",
                application_deadline: "2023-12-15",
              },
            ],
          },
          {
            id: "2",
            name: "Riverside Elementary",
            location: "Boston, MA",
            image_url:
              "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
            vacancies: [
              {
                id: "v3",
                position: "Elementary Teacher",
                subjects: "All Subjects",
                grade_levels: "3-5",
                experience_required: 1,
                description: "Elementary school teacher for grades 3-5.",
                salary_range: "$50,000 - $65,000",
                application_deadline: "2023-11-30",
              },
            ],
          },
          {
            id: "3",
            name: "Tech Preparatory School",
            location: "San Francisco, CA",
            image_url:
              "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
            vacancies: [
              {
                id: "v4",
                position: "Computer Science Teacher",
                subjects: "Programming, Web Development",
                grade_levels: "9-12",
                experience_required: 4,
                description:
                  "Computer science teacher with industry experience needed.",
                salary_range: "$70,000 - $90,000",
                application_deadline: "2023-12-20",
              },
              {
                id: "v5",
                position: "Digital Arts Teacher",
                subjects: "Digital Design, Photography",
                grade_levels: "9-12",
                experience_required: 2,
                description: "Digital arts teacher for high school students.",
                salary_range: "$55,000 - $75,000",
                application_deadline: "2023-12-10",
              },
            ],
          },
          {
            id: "4",
            name: "Oakridge International School",
            location: "Chicago, IL",
            image_url:
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
            vacancies: [
              {
                id: "v6",
                position: "Physics Teacher",
                subjects: "Physics, Mathematics",
                grade_levels: "11-12",
                experience_required: 5,
                description:
                  "Experienced physics teacher for advanced placement courses.",
                salary_range: "$65,000 - $80,000",
                application_deadline: "2023-11-25",
              },
            ],
          },
          {
            id: "5",
            name: "Westlake High School",
            location: "Austin, TX",
            image_url:
              "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
            vacancies: [
              {
                id: "v7",
                position: "English Teacher",
                subjects: "English Literature, Creative Writing",
                grade_levels: "9-12",
                experience_required: 3,
                description:
                  "English teacher with experience in creative writing instruction.",
                salary_range: "$55,000 - $70,000",
                application_deadline: "2023-12-05",
              },
              {
                id: "v8",
                position: "History Teacher",
                subjects: "World History, American History",
                grade_levels: "9-12",
                experience_required: 2,
                description:
                  "History teacher with a passion for engaging students.",
                salary_range: "$52,000 - $68,000",
                application_deadline: "2023-12-10",
              },
            ],
          },
          {
            id: "6",
            name: "Sunshine Montessori",
            location: "Miami, FL",
            image_url:
              "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
            vacancies: [
              {
                id: "v9",
                position: "Montessori Teacher",
                subjects: "Early Childhood Education",
                grade_levels: "Pre-K - 3",
                experience_required: 2,
                description:
                  "Certified Montessori teacher for early childhood education.",
                salary_range: "$48,000 - $60,000",
                application_deadline: "2023-11-30",
              },
            ],
          },
          {
            id: "7",
            name: "Pacific Heights Academy",
            location: "Seattle, WA",
            image_url:
              "https://images.unsplash.com/photo-1613896640137-bb5b31496315?w=800&q=80",
            vacancies: [
              {
                id: "v10",
                position: "Music Teacher",
                subjects: "Music Theory, Instrumental Music",
                grade_levels: "K-12",
                experience_required: 3,
                description:
                  "Music teacher with instrumental and vocal experience.",
                salary_range: "$50,000 - $65,000",
                application_deadline: "2023-12-15",
              },
              {
                id: "v11",
                position: "Art Teacher",
                subjects: "Visual Arts, Art History",
                grade_levels: "K-12",
                experience_required: 2,
                description:
                  "Art teacher with experience in various mediums and art history.",
                salary_range: "$48,000 - $62,000",
                application_deadline: "2023-12-20",
              },
            ],
          },
          {
            id: "8",
            name: "Lakeside Preparatory",
            location: "Minneapolis, MN",
            image_url:
              "https://images.unsplash.com/photo-1594312915251-48db9280c8f1?w=800&q=80",
            vacancies: [
              {
                id: "v12",
                position: "Physical Education Teacher",
                subjects: "Physical Education, Health",
                grade_levels: "K-8",
                experience_required: 1,
                description:
                  "PE teacher with coaching experience for elementary and middle school.",
                salary_range: "$45,000 - $58,000",
                application_deadline: "2023-11-28",
              },
            ],
          },
          {
            id: "9",
            name: "Evergreen Waldorf School",
            location: "Portland, OR",
            image_url:
              "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=800&q=80",
            vacancies: [
              {
                id: "v13",
                position: "Waldorf Teacher",
                subjects: "Integrated Curriculum",
                grade_levels: "1-8",
                experience_required: 3,
                description:
                  "Experienced Waldorf teacher for elementary grades.",
                salary_range: "$52,000 - $68,000",
                application_deadline: "2023-12-05",
              },
            ],
          },
          {
            id: "10",
            name: "Innovation STEM Academy",
            location: "Denver, CO",
            image_url:
              "https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?w=800&q=80",
            vacancies: [
              {
                id: "v14",
                position: "Robotics Teacher",
                subjects: "Robotics, Engineering",
                grade_levels: "6-12",
                experience_required: 4,
                description:
                  "Robotics and engineering teacher with competition experience.",
                salary_range: "$60,000 - $78,000",
                application_deadline: "2023-12-10",
              },
              {
                id: "v15",
                position: "Mathematics Teacher",
                subjects: "Advanced Mathematics, Calculus",
                grade_levels: "9-12",
                experience_required: 3,
                description:
                  "Advanced mathematics teacher for high-performing STEM academy.",
                salary_range: "$58,000 - $75,000",
                application_deadline: "2023-12-15",
              },
            ],
          },
          {
            id: "11",
            name: "Global Language Academy",
            location: "Washington, DC",
            image_url:
              "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
            vacancies: [
              {
                id: "v16",
                position: "Spanish Teacher",
                subjects: "Spanish Language, Hispanic Culture",
                grade_levels: "K-12",
                experience_required: 2,
                description: "Spanish language teacher for immersion program.",
                salary_range: "$52,000 - $68,000",
                application_deadline: "2023-12-01",
              },
              {
                id: "v17",
                position: "Mandarin Teacher",
                subjects: "Mandarin Chinese, Chinese Culture",
                grade_levels: "K-12",
                experience_required: 3,
                description:
                  "Mandarin Chinese teacher for language immersion program.",
                salary_range: "$54,000 - $70,000",
                application_deadline: "2023-12-05",
              },
            ],
          },
          {
            id: "12",
            name: "Harmony Arts School",
            location: "Nashville, TN",
            image_url:
              "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
            vacancies: [
              {
                id: "v18",
                position: "Dance Instructor",
                subjects: "Ballet, Contemporary Dance",
                grade_levels: "6-12",
                experience_required: 5,
                description:
                  "Professional dance instructor for performing arts school.",
                salary_range: "$50,000 - $65,000",
                application_deadline: "2023-11-25",
              },
              {
                id: "v19",
                position: "Drama Teacher",
                subjects: "Theater Arts, Playwriting",
                grade_levels: "6-12",
                experience_required: 3,
                description:
                  "Drama teacher with directing and production experience.",
                salary_range: "$48,000 - $62,000",
                application_deadline: "2023-12-10",
              },
            ],
          },
          {
            id: "13",
            name: "Coastal Academy",
            location: "San Diego, CA",
            image_url:
              "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&q=80",
            vacancies: [
              {
                id: "v20",
                position: "Marine Science Teacher",
                subjects: "Marine Biology, Environmental Science",
                grade_levels: "9-12",
                experience_required: 3,
                description:
                  "Marine science teacher for coastal-focused curriculum.",
                salary_range: "$56,000 - $72,000",
                application_deadline: "2023-12-15",
              },
            ],
          },
          {
            id: "14",
            name: "Northstar Preparatory",
            location: "Anchorage, AK",
            image_url:
              "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80",
            vacancies: [
              {
                id: "v21",
                position: "Science Teacher",
                subjects: "Earth Science, Astronomy",
                grade_levels: "6-12",
                experience_required: 2,
                description:
                  "Science teacher with focus on earth sciences and astronomy.",
                salary_range: "$54,000 - $70,000",
                application_deadline: "2023-12-01",
              },
            ],
          },
          {
            id: "15",
            name: "Heritage Classical Academy",
            location: "Phoenix, AZ",
            image_url:
              "https://images.unsplash.com/photo-1567448400815-59d5a71b1a91?w=800&q=80",
            vacancies: [
              {
                id: "v22",
                position: "Latin Teacher",
                subjects: "Latin, Classical Studies",
                grade_levels: "6-12",
                experience_required: 3,
                description: "Latin teacher for classical curriculum program.",
                salary_range: "$52,000 - $68,000",
                application_deadline: "2023-11-30",
              },
              {
                id: "v23",
                position: "Philosophy Teacher",
                subjects: "Philosophy, Ethics",
                grade_levels: "9-12",
                experience_required: 4,
                description:
                  "Philosophy teacher for advanced classical curriculum.",
                salary_range: "$56,000 - $72,000",
                application_deadline: "2023-12-10",
              },
            ],
          },
          {
            id: "16",
            name: "Meadowbrook Elementary",
            location: "Atlanta, GA",
            image_url:
              "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
            vacancies: [
              {
                id: "v24",
                position: "Special Education Teacher",
                subjects: "Special Education",
                grade_levels: "K-5",
                experience_required: 3,
                description:
                  "Special education teacher for inclusive elementary program.",
                salary_range: "$54,000 - $70,000",
                application_deadline: "2023-11-25",
              },
            ],
          },
          {
            id: "17",
            name: "Fusion Tech High School",
            location: "Raleigh, NC",
            image_url:
              "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
            vacancies: [
              {
                id: "v25",
                position: "Game Design Teacher",
                subjects: "Game Development, Computer Science",
                grade_levels: "9-12",
                experience_required: 3,
                description:
                  "Game design and development teacher for technology-focused high school.",
                salary_range: "$58,000 - $75,000",
                application_deadline: "2023-12-15",
              },
              {
                id: "v26",
                position: "Digital Media Teacher",
                subjects: "Digital Media, Graphic Design",
                grade_levels: "9-12",
                experience_required: 2,
                description:
                  "Digital media and design teacher for creative technology program.",
                salary_range: "$54,000 - $70,000",
                application_deadline: "2023-12-10",
              },
            ],
          },
          {
            id: "18",
            name: "Bridgewater Middle School",
            location: "Philadelphia, PA",
            image_url:
              "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
            vacancies: [
              {
                id: "v27",
                position: "Mathematics Teacher",
                subjects: "Middle School Mathematics",
                grade_levels: "6-8",
                experience_required: 2,
                description: "Mathematics teacher for middle school students.",
                salary_range: "$50,000 - $65,000",
                application_deadline: "2023-12-05",
              },
              {
                id: "v28",
                position: "Science Teacher",
                subjects: "General Science, STEM",
                grade_levels: "6-8",
                experience_required: 1,
                description:
                  "Science teacher with hands-on STEM approach for middle school.",
                salary_range: "$48,000 - $62,000",
                application_deadline: "2023-12-10",
              },
            ],
          },
          {
            id: "19",
            name: "Summit International School",
            location: "Houston, TX",
            image_url:
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
            vacancies: [
              {
                id: "v29",
                position: "French Teacher",
                subjects: "French Language, Francophone Culture",
                grade_levels: "K-12",
                experience_required: 3,
                description:
                  "French language teacher for international baccalaureate program.",
                salary_range: "$54,000 - $70,000",
                application_deadline: "2023-12-01",
              },
              {
                id: "v30",
                position: "IB Coordinator",
                subjects: "International Baccalaureate",
                grade_levels: "9-12",
                experience_required: 5,
                description:
                  "Experienced IB coordinator and teacher for international program.",
                salary_range: "$65,000 - $85,000",
                application_deadline: "2023-11-25",
              },
            ],
          },
          {
            id: "20",
            name: "Riverdale Montessori",
            location: "New Orleans, LA",
            image_url:
              "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
            vacancies: [
              {
                id: "v31",
                position: "Elementary Montessori Guide",
                subjects: "Montessori Elementary Curriculum",
                grade_levels: "1-6",
                experience_required: 3,
                description:
                  "AMI/AMS certified Montessori guide for elementary program.",
                salary_range: "$52,000 - $68,000",
                application_deadline: "2023-12-05",
              },
            ],
          },
        ];

        setSchools(dummySchools);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setError("Failed to load schools. Please try again later.");
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Loading schools...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Available Schools</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <Card
            key={school.id}
            className="overflow-hidden h-full flex flex-col"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={school.image_url}
                alt={school.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{school.name}</CardTitle>
              <CardDescription>{school.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <h3 className="font-semibold mb-2">
                Open Positions: {school.vacancies.length}
              </h3>
              <div className="space-y-4">
                {school.vacancies.map((vacancy) => (
                  <div key={vacancy.id} className="border-b pb-3 last:border-0">
                    <h4 className="font-medium text-blue-600">
                      {vacancy.position}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">{vacancy.subjects}</Badge>
                      <Badge variant="outline">
                        Grades {vacancy.grade_levels}
                      </Badge>
                      {vacancy.experience_required && (
                        <Badge variant="outline">
                          {vacancy.experience_required}+ years exp
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mt-2 text-gray-600">
                      {vacancy.salary_range}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
