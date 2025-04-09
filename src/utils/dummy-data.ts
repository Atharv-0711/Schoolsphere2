/**
 * Utility functions for generating dummy teacher profile data
 */

// Generate a random item from an array
const randomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Generate a random integer between min and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random teacher profile data
export const generateDummyTeacherProfile = () => {
  const firstNames = [
    "Aisha",
    "Rahul",
    "Priya",
    "Vikram",
    "Neha",
    "Arjun",
    "Divya",
    "Sanjay",
    "Meera",
    "Rajiv",
  ];

  const lastNames = [
    "Sharma",
    "Patel",
    "Singh",
    "Kumar",
    "Gupta",
    "Verma",
    "Joshi",
    "Malhotra",
    "Reddy",
    "Nair",
  ];

  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
  ];

  const states = [
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Telangana",
    "Tamil Nadu",
    "West Bengal",
    "Gujarat",
    "Rajasthan",
    "Uttar Pradesh",
    "Kerala",
  ];

  const qualifications = [
    "B.Ed",
    "M.Ed",
    "Ph.D in Education",
    "B.Sc B.Ed",
    "M.A. in Education",
    "CTET Qualified",
    "NET Qualified",
    "STET Qualified",
  ];

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "Hindi",
    "Social Studies",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Environmental Studies",
  ];

  const gradeLevels = [
    "Primary (1-5)",
    "Middle School (6-8)",
    "Secondary (9-10)",
    "Senior Secondary (11-12)",
    "K-12",
    "6-12",
    "1-8",
  ];

  const teachingMethodologies = [
    "Project-based learning",
    "Inquiry-based learning",
    "Collaborative learning",
    "Differentiated instruction",
    "Flipped classroom",
    "Gamification",
    "Experiential learning",
    "Direct instruction",
    "Montessori method",
  ];

  const classroomManagement = [
    "Positive reinforcement",
    "Clear expectations",
    "Consistent routines",
    "Student engagement",
    "Behavior contracts",
    "Token economy",
    "Restorative practices",
    "Collaborative problem-solving",
  ];

  const skills = [
    "Curriculum development",
    "Assessment design",
    "Classroom management",
    "Technology integration",
    "Differentiated instruction",
    "Parent communication",
    "Student counseling",
    "Special education",
  ];

  const techProficiency = [
    "Google Classroom",
    "Microsoft Teams",
    "Zoom",
    "Kahoot",
    "Quizlet",
    "Canva",
    "Padlet",
    "Nearpod",
    "Edmodo",
    "Moodle",
    "Smart Boards",
    "Digital assessment tools",
  ];

  const extracurricular = [
    "Sports coaching",
    "Drama club",
    "Debate team",
    "Music",
    "Art club",
    "Science club",
    "Math Olympiad",
    "Robotics",
    "Coding club",
    "Environmental club",
  ];

  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);

  // Generate 2-4 random subjects
  const numSubjects = randomInt(2, 4);
  const selectedSubjects = [];
  const subjectsCopy = [...subjects];
  for (let i = 0; i < numSubjects; i++) {
    if (subjectsCopy.length > 0) {
      const index = Math.floor(Math.random() * subjectsCopy.length);
      selectedSubjects.push(subjectsCopy[index]);
      subjectsCopy.splice(index, 1);
    }
  }

  // Generate 2-3 random teaching methodologies
  const numMethodologies = randomInt(2, 3);
  const selectedMethodologies = [];
  for (let i = 0; i < numMethodologies; i++) {
    selectedMethodologies.push(randomItem(teachingMethodologies));
  }

  // Generate 2-3 random classroom management strategies
  const numStrategies = randomInt(2, 3);
  const selectedStrategies = [];
  for (let i = 0; i < numStrategies; i++) {
    selectedStrategies.push(randomItem(classroomManagement));
  }

  // Generate 3-5 random skills
  const numSkills = randomInt(3, 5);
  const selectedSkills = [];
  for (let i = 0; i < numSkills; i++) {
    selectedSkills.push(randomItem(skills));
  }

  // Generate 2-4 random tech proficiencies
  const numTech = randomInt(2, 4);
  const selectedTech = [];
  for (let i = 0; i < numTech; i++) {
    selectedTech.push(randomItem(techProficiency));
  }

  // Generate 1-3 random extracurricular activities
  const numExtra = randomInt(1, 3);
  const selectedExtra = [];
  for (let i = 0; i < numExtra; i++) {
    selectedExtra.push(randomItem(extracurricular));
  }

  return {
    personal: {
      full_name: `${firstName} ${lastName}`,
      phone: `+91 ${randomInt(7000000000, 9999999999)}`,
      address: `${randomInt(1, 100)}, ${randomItem(["Park Street", "Main Road", "Gandhi Nagar", "Nehru Place", "MG Road"])}`,
      city: randomItem(cities),
      state: randomItem(states),
    },
    professional: {
      professional_summary: `Dedicated and passionate educator with ${randomInt(2, 15)} years of experience teaching ${selectedSubjects.join(" and ")}. Committed to creating an engaging and inclusive learning environment for all students.`,
      qualification: randomItem(qualifications),
      experience: randomInt(2, 15),
      subjects: selectedSubjects.join(", "),
      grade_levels: randomItem(gradeLevels),
      bio: `I am a ${randomItem(qualifications)} qualified teacher specializing in ${selectedSubjects.join(" and ")}. I believe in creating a positive and stimulating learning environment where students can thrive academically and personally.`,
    },
    education: {
      degree_0: randomItem(["B.Ed", "B.Sc", "B.A", "M.A"]),
      institution_0: randomItem([
        "Delhi University",
        "Mumbai University",
        "Bangalore University",
        "Pune University",
        "IIT Delhi",
      ]),
      year_0: `${randomInt(2000, 2020)}`,
      grade_0: `${randomInt(60, 95)}%`,
      skills: selectedSkills.join(", "),
      teaching_methodologies: selectedMethodologies.join(", "),
      classroom_management: selectedStrategies.join(", "),
    },
    additional: {
      lesson_planning: `I use a structured approach to lesson planning, focusing on clear learning objectives, engaging activities, and formative assessments to track student progress.`,
      tech_proficiency: selectedTech.join(", "),
      extracurricular: selectedExtra.join(", "),
      research: `Impact of ${randomItem(teachingMethodologies)} on Student Achievement`,
      workshops: `${randomItem(["National", "State", "Regional"])} Teacher Training Workshop\nInnovative Teaching Strategies Seminar`,
      awards: `Best Teacher Award ${randomInt(2015, 2023)}\nExcellence in Education ${randomInt(2015, 2023)}`,
      memberships: `Indian Association of Teachers\nNational Education Society`,
      references: `Dr. ${randomItem(firstNames)} ${randomItem(lastNames)}, Principal, ${randomItem(["Delhi Public School", "Kendriya Vidyalaya", "DAV Public School", "Ryan International School"])}\nProf. ${randomItem(firstNames)} ${randomItem(lastNames)}, ${randomItem(["Delhi University", "Mumbai University", "Bangalore University", "Pune University"])}`,
    },
  };
};
