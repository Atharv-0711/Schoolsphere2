import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in" },
        { status: 401 },
      );
    }

    if (user.user_metadata?.user_role !== "teacher") {
      return NextResponse.json(
        { error: "Only teachers can access this page" },
        { status: 403 },
      );
    }

    const { section, formData } = await request.json();

    // Check if teacher profile exists
    const { data: existingProfile } = await supabase
      .from("teacher_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let profileData = {};

    if (existingProfile) {
      // Update existing profile
      profileData = { ...existingProfile };
    } else {
      // Initialize new profile
      profileData = {
        user_id: user.id,
        created_at: new Date().toISOString(),
        // Initialize with basic structure
      };
    }

    // Update the specific section
    switch (section) {
      case "personal":
        // Extract individual fields from formData instead of storing as an object
        profileData = {
          ...profileData,
          first_name: formData.first_name || "",
          last_name: formData.last_name || "",
          email: formData.email || user.email || "",
          phone: formData.phone || "",
          address: formData.address || "",
          city: formData.city || "",
          state: formData.state || "",
          zip_code: formData.zip_code || "",
          country: formData.country || "",
          // Store personal_information for backward compatibility
          personal_information: {
            full_name:
              formData.full_name || user.user_metadata?.full_name || "",
            phone: formData.phone || "",
            address: formData.address || "",
            city: formData.city || "",
            state: formData.state || "",
          },
        };
        break;
      case "professional":
        profileData = {
          ...profileData,
          professional_summary: formData.professional_summary || "",
          qualification: formData.qualification || "",
          experience: formData.experience ? parseInt(formData.experience) : 0,
          subjects: formData.subjects || "",
          grade_levels: formData.grade_levels || "",
          bio: formData.bio || "",
        };
        break;
      case "education":
        const educationalQualifications = [];
        const teachingCertifications = [];

        // Process educational qualifications
        for (let i = 0; i < 10; i++) {
          if (formData[`degree_${i}`]) {
            educationalQualifications.push({
              degree: formData[`degree_${i}`],
              institution: formData[`institution_${i}`] || "",
              year: formData[`year_${i}`] || "",
              grade: formData[`grade_${i}`] || "",
            });
          }
        }

        // Process teaching certifications
        for (let i = 0; i < 10; i++) {
          if (formData[`cert_name_${i}`]) {
            teachingCertifications.push({
              name: formData[`cert_name_${i}`],
              authority: formData[`cert_authority_${i}`] || "",
              year: formData[`cert_year_${i}`] || "",
            });
          }
        }

        profileData = {
          ...profileData,
          educational_qualifications: educationalQualifications,
          teaching_certifications: teachingCertifications,
          skills: formData.skills
            ? formData.skills.split(",").map((s: string) => s.trim())
            : [],
          teaching_methodologies: formData.teaching_methodologies
            ? formData.teaching_methodologies
                .split(",")
                .map((s: string) => s.trim())
            : [],
          // Store classroom management as a field in the profile
          classroom_management: formData.classroom_management
            ? formData.classroom_management
                .split(",")
                .map((s: string) => s.trim())
            : [],
          classroom_management_strategies: formData.classroom_management
            ? formData.classroom_management
                .split(",")
                .map((s: string) => s.trim())
            : [],
        };
        break;
      case "additional":
        profileData = {
          ...profileData,
          lesson_planning: formData.lesson_planning || "",
          technological_proficiency: formData.tech_proficiency
            ? formData.tech_proficiency.split(",").map((s: string) => s.trim())
            : [],
          research_publications: formData.research
            ? formData.research
                .split("\n")
                .map((s: string) => ({ title: s.trim() }))
            : [],
          workshops_training: formData.workshops
            ? formData.workshops
                .split("\n")
                .map((s: string) => ({ name: s.trim() }))
            : [],
          extracurricular_activities: formData.extracurricular
            ? formData.extracurricular.split(",").map((s: string) => s.trim())
            : [],
          awards_recognitions: formData.awards
            ? formData.awards
                .split("\n")
                .map((s: string) => ({ title: s.trim() }))
            : [],
          professional_memberships: formData.memberships
            ? formData.memberships
                .split("\n")
                .map((s: string) => ({ organization: s.trim() }))
            : [],
          references: formData.references
            ? formData.references
                .split("\n")
                .map((s: string) => ({ details: s.trim() }))
            : [],
        };
        break;
      default:
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    // Save to database
    let result;
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from("teacher_profiles")
        .update(profileData)
        .eq("user_id", user.id);
    } else {
      // Insert new profile
      result = await supabase.from("teacher_profiles").insert(profileData);
    }

    if (result.error) {
      console.error("Error saving teacher profile:", result.error);
      return NextResponse.json(
        { error: "Failed to save profile: " + result.error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile section saved",
    });
  } catch (error) {
    console.error("Error in teacher profile API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in" },
        { status: 401 },
      );
    }

    // Get teacher profile
    const { data: profile, error } = await supabase
      .from("teacher_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching teacher profile:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 },
      );
    }

    return NextResponse.json({ profile: profile || null });
  } catch (error) {
    console.error("Error in teacher profile API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
