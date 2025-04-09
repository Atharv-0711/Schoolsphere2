import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { generateDummyTeacherProfile } from "@/utils/dummy-data";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Generate dummy data
    const dummyData = generateDummyTeacherProfile();

    // Create a random email and password
    const randomNum = Math.floor(Math.random() * 10000);
    const email = `teacher${randomNum}@example.com`;
    const password = "password123"; // Simple password for dummy accounts

    // Create the user in Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: dummyData.personal.full_name,
          email: email,
          user_role: "teacher",
        },
      },
    });

    if (userError || !userData.user) {
      console.error("Error creating dummy user:", userError);
      return NextResponse.json(
        { error: userError?.message || "Failed to create user" },
        { status: 500 },
      );
    }

    // Create entry in users table
    const { error: profileError } = await supabase.from("users").insert({
      id: userData.user.id,
      name: dummyData.personal.full_name,
      full_name: dummyData.personal.full_name,
      email: email,
      user_id: userData.user.id,
      token_identifier: userData.user.id,
      created_at: new Date().toISOString(),
      user_role: "teacher",
    });

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 },
      );
    }

    // Create teacher profile
    const { error: teacherProfileError } = await supabase
      .from("teacher_profiles")
      .insert({
        user_id: userData.user.id,
        qualification: dummyData.professional.qualification,
        experience: parseInt(dummyData.professional.experience.toString()),
        subjects: dummyData.professional.subjects,
        grade_levels: dummyData.professional.grade_levels,
        bio: dummyData.professional.bio,
        resume_url: "", // Empty string instead of actual URL
        created_at: new Date().toISOString(),
        personal_information: dummyData.personal,
        professional_summary: dummyData.professional.professional_summary,
        educational_qualifications: [
          {
            degree: dummyData.education.degree_0,
            institution: dummyData.education.institution_0,
            year: dummyData.education.year_0,
            grade: dummyData.education.grade_0,
          },
        ],
        teaching_certifications: [
          {
            name: "CTET",
            authority: "CBSE",
            year: "2020",
          },
        ],
        skills: dummyData.education.skills.split(",").map((s) => s.trim()),
        teaching_methodologies: dummyData.education.teaching_methodologies
          .split(",")
          .map((s) => s.trim()),
        classroom_management_strategies:
          dummyData.education.classroom_management
            .split(",")
            .map((s) => s.trim()),
        lesson_planning: dummyData.additional.lesson_planning,
        technological_proficiency: dummyData.additional.tech_proficiency
          .split(",")
          .map((s) => s.trim()),
        research_publications: dummyData.additional.research
          .split("\n")
          .map((s) => ({ title: s.trim() })),
        workshops_training: dummyData.additional.workshops
          .split("\n")
          .map((s) => ({ name: s.trim() })),
        extracurricular_activities: dummyData.additional.extracurricular
          .split(",")
          .map((s) => s.trim()),
        awards_recognitions: dummyData.additional.awards
          .split("\n")
          .map((s) => ({ title: s.trim() })),
        professional_memberships: dummyData.additional.memberships
          .split("\n")
          .map((s) => ({ organization: s.trim() })),
        references: dummyData.additional.references
          .split("\n")
          .map((s) => ({ details: s.trim() })),
        looking_for_school: true,
      });

    if (teacherProfileError) {
      console.error("Error creating teacher profile:", teacherProfileError);
      return NextResponse.json(
        { error: teacherProfileError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dummy teacher created successfully",
      user: {
        id: userData.user.id,
        email,
        name: dummyData.personal.full_name,
        password: password, // Only for demonstration purposes
      },
    });
  } catch (error: any) {
    console.error("Error in create-dummy-teacher API:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
