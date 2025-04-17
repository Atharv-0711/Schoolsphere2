"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const userRole = formData.get("user_role")?.toString() || "student";
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
        user_role: userRole,
      },
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        user_id: user.id,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
        user_role: userRole,
      });

      if (updateError) {
        console.error("Error updating user profile:", updateError);
      }
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const userRole = formData.get("user_role") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Update user metadata with role if it's different
  if (data.user && userRole) {
    if (data.user.user_metadata.user_role !== userRole) {
      await supabase.auth.updateUser({
        data: { user_role: userRole },
      });
    }
  }

  // If user is a teacher, check if they have completed their profile
  if (data.user && data.user.user_metadata?.user_role === "teacher") {
    const { data: teacherProfile } = await supabase
      .from("teacher_profiles")
      .select("*")
      .eq("user_id", data.user.id)
      .single();

    if (!teacherProfile) {
      return redirect("/teacher-profile");
    }

    return redirect("/teacher/vacancies");
  }

  // If user is a school admin, check if they have completed their school profile
  if (data.user && data.user.user_metadata?.user_role === "admin") {
    const { data: schoolProfile } = await supabase
      .from("school_profiles")
      .select("*")
      .eq("user_id", data.user.id)
      .single();

    if (!schoolProfile) {
      return redirect("/school-details");
    }
  }

  return redirect("/dashboard");
};

export const saveTeacherProfileAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in");
  }

  if (user.user_metadata?.user_role !== "teacher") {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Only teachers can access this page",
    );
  }

  // Basic required fields
  const qualification = formData.get("qualification")?.toString();
  const experience = formData.get("experience")?.toString();
  const subjects = formData.get("subjects")?.toString();
  const gradeLevels = formData.get("grade_levels")?.toString();
  const bio = formData.get("bio")?.toString();
  const professionalSummary =
    formData.get("professional_summary")?.toString() || "";
  const fullName =
    formData.get("full_name")?.toString() ||
    user.user_metadata?.full_name ||
    "";
  const phone = formData.get("phone")?.toString() || "";
  const address = formData.get("address")?.toString() || "";
  const city = formData.get("city")?.toString() || "";
  const state = formData.get("state")?.toString() || "";
  const country = formData.get("country")?.toString() || "";

  // Log form data for debugging
  console.log("Form data validation:", {
    qualification,
    experience,
    subjects,
    gradeLevels,
    bio,
    professionalSummary,
    fullName,
    phone,
    address,
    city,
    state,
    country,
  });

  // Check if all required fields are present
  if (
    !qualification ||
    !experience ||
    !subjects ||
    !gradeLevels ||
    !bio ||
    !professionalSummary ||
    !fullName ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !country
  ) {
    // Log which fields are missing
    const missingFields = [];
    if (!qualification) missingFields.push("qualification");
    if (!experience) missingFields.push("experience");
    if (!subjects) missingFields.push("subjects");
    if (!gradeLevels) missingFields.push("grade_levels");
    if (!bio) missingFields.push("bio");
    if (!professionalSummary) missingFields.push("professional_summary");
    if (!fullName) missingFields.push("full_name");
    if (!phone) missingFields.push("phone");
    if (!address) missingFields.push("address");
    if (!city) missingFields.push("city");
    if (!state) missingFields.push("state");
    if (!country) missingFields.push("country");

    console.error("Missing fields:", missingFields);

    return encodedRedirect(
      "error",
      "/teacher-profile",
      `Missing required fields: ${missingFields.join(", ")}`,
    );
  }

  // Personal information
  const personalInfo = {
    full_name: fullName,
    phone,
    address,
    city,
    state,
    country,
  };

  // Educational qualifications
  const educationCount = parseInt(
    formData.get("education_count")?.toString() || "1",
  );
  const educationalQualifications = [];

  for (let i = 0; i < educationCount; i++) {
    const degree = formData.get(`education_degree_${i}`)?.toString();
    const institution = formData.get(`education_institution_${i}`)?.toString();
    const year = formData.get(`education_year_${i}`)?.toString();
    const grade = formData.get(`education_grade_${i}`)?.toString();

    if (degree && institution && year) {
      educationalQualifications.push({
        degree,
        institution,
        year,
        grade: grade || "",
      });
    }
  }

  // Teaching certifications
  const certCount = parseInt(
    formData.get("certification_count")?.toString() || "1",
  );
  const teachingCertifications = [];

  for (let i = 0; i < certCount; i++) {
    const name = formData.get(`cert_name_${i}`)?.toString();
    const authority = formData.get(`cert_authority_${i}`)?.toString();
    const year = formData.get(`cert_year_${i}`)?.toString();

    if (name && authority && year) {
      teachingCertifications.push({
        name,
        authority,
        year,
      });
    }
  }

  // Skills and methodologies
  const skills = formData.get("skills")?.toString() || "";
  const teachingMethodologies =
    formData.get("teaching_methodologies")?.toString() || "";
  const classroomManagement =
    formData.get("classroom_management")?.toString() || "";
  const lessonPlanning = formData.get("lesson_planning")?.toString() || "";
  const techProficiency = formData.get("tech_proficiency")?.toString() || "";
  const research = formData.get("research")?.toString() || "";
  const workshops = formData.get("workshops")?.toString() || "";
  const extracurricular = formData.get("extracurricular")?.toString() || "";
  const awards = formData.get("awards")?.toString() || "";
  const memberships = formData.get("memberships")?.toString() || "";
  const references = formData.get("references")?.toString() || "";

  // Save teacher profile to database
  const { error: profileError } = await supabase
    .from("teacher_profiles")
    .insert({
      user_id: user.id,
      qualification,
      experience: parseInt(experience),
      subjects,
      grade_levels: gradeLevels,
      bio,
      resume_url: "", // Empty string instead of actual URL
      created_at: new Date().toISOString(),
      personal_information: personalInfo,
      professional_summary: professionalSummary,
      educational_qualifications: educationalQualifications,
      teaching_certifications: teachingCertifications,
      skills: skills ? skills.split(",").map((s) => s.trim()) : [],
      teaching_methodologies: teachingMethodologies
        ? teachingMethodologies.split(",").map((s) => s.trim())
        : [],
      classroom_management_strategies: classroomManagement
        ? classroomManagement.split(",").map((s) => s.trim())
        : [],
      lesson_planning: lessonPlanning,
      technological_proficiency: techProficiency
        ? techProficiency.split(",").map((s) => s.trim())
        : [],
      research_publications: research
        ? research.split("\n").map((s) => ({ title: s.trim() }))
        : [],
      workshops_training: workshops
        ? workshops.split("\n").map((s) => ({ name: s.trim() }))
        : [],
      extracurricular_activities: extracurricular
        ? extracurricular.split(",").map((s) => s.trim())
        : [],
      awards_recognitions: awards
        ? awards.split("\n").map((s) => ({ title: s.trim() }))
        : [],
      professional_memberships: memberships
        ? memberships.split("\n").map((s) => ({ organization: s.trim() }))
        : [],
      references: references
        ? references.split("\n").map((s) => ({ details: s.trim() }))
        : [],
      looking_for_school: true,
    });

  if (profileError) {
    console.error("Error saving teacher profile:", profileError);
    return encodedRedirect(
      "error",
      "/teacher-profile",
      "Failed to save profile: " + profileError.message,
    );
  }

  return redirect("/teacher/school-selection");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Password updated successfully",
  );
};

export const saveSchoolDetailsAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in");
  }

  if (user.user_metadata?.user_role !== "admin") {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Only school administrators can access this page",
    );
  }

  const schoolName = formData.get("school_name")?.toString();
  const location = formData.get("location")?.toString();
  const teacherCount = formData.get("teacher_count")?.toString();
  const studentCount = formData.get("student_count")?.toString();

  if (!schoolName || !location || !teacherCount || !studentCount) {
    return encodedRedirect(
      "error",
      "/school-details",
      "All fields are required",
    );
  }

  // Save school profile to database
  const { error: profileError } = await supabase
    .from("school_profiles")
    .insert({
      user_id: user.id,
      school_name: schoolName,
      location: location,
      teacher_count: parseInt(teacherCount),
      student_count: parseInt(studentCount),
      created_at: new Date().toISOString(),
    });

  if (profileError) {
    console.error("Error saving school profile:", profileError);
    return encodedRedirect(
      "error",
      "/school-details",
      "Failed to save school details",
    );
  }

  return redirect("/dashboard");
};

export const sendMessageAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in");
  }

  const recipientId = formData.get("recipient_id")?.toString();
  const subject = formData.get("subject")?.toString();
  const content = formData.get("content")?.toString();

  if (!recipientId || !subject || !content) {
    return encodedRedirect("error", "/messages/new", "All fields are required");
  }

  // Save message to database
  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    recipient_id: recipientId,
    subject,
    content,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error sending message:", error);
    return encodedRedirect("error", "/messages/new", "Failed to send message");
  }

  return redirect("/messages");
};

export const replyToMessageAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in");
  }

  const parentMessageId = formData.get("parent_message_id")?.toString();
  const recipientId = formData.get("recipient_id")?.toString();
  const subject = formData.get("subject")?.toString();
  const content = formData.get("content")?.toString();

  if (!parentMessageId || !recipientId || !subject || !content) {
    return encodedRedirect(
      "error",
      `/messages/${parentMessageId}`,
      "All fields are required",
    );
  }

  // Save reply to database
  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    recipient_id: recipientId,
    subject,
    content,
    parent_message_id: parentMessageId,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error sending reply:", error);
    return encodedRedirect(
      "error",
      `/messages/${parentMessageId}`,
      "Failed to send reply",
    );
  }

  return redirect(`/messages/${parentMessageId}`);
};

export const markMessageAsReadAction = async (messageId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  // Mark message as read
  await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", messageId)
    .eq("recipient_id", user.id);
};

export const scheduleMeetingAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be signed in");
  }

  // Check if user is a teacher
  if (user.user_metadata?.user_role !== "teacher") {
    return encodedRedirect(
      "error",
      "/meetings",
      "Only teachers can schedule meetings",
    );
  }

  const parentId = formData.get("parent_id")?.toString();
  const studentId = formData.get("student_id")?.toString() || null;
  const title = formData.get("title")?.toString();
  const meetingDate = formData.get("meeting_date")?.toString();
  const durationMinutes = parseInt(
    formData.get("duration_minutes")?.toString() || "30",
  );
  const meetingLink = formData.get("meeting_link")?.toString() || null;
  const description = formData.get("description")?.toString() || null;

  if (!parentId || !title || !meetingDate) {
    return encodedRedirect(
      "error",
      "/meetings/schedule",
      "Required fields are missing",
    );
  }

  // Save meeting to database
  const { error } = await supabase.from("meetings").insert({
    teacher_id: user.id,
    parent_id: parentId,
    student_id: studentId,
    title,
    description,
    meeting_date: meetingDate,
    duration_minutes: durationMinutes,
    meeting_link: meetingLink,
    status: "scheduled",
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error scheduling meeting:", error);
    return encodedRedirect(
      "error",
      "/meetings/schedule",
      "Failed to schedule meeting",
    );
  }

  // Send notification message to parent
  await supabase.from("messages").insert({
    sender_id: user.id,
    recipient_id: parentId,
    subject: `Meeting Invitation: ${title}`,
    content: `I'd like to invite you to a meeting on ${new Date(meetingDate).toLocaleString()}.

${description || ""}

Please confirm your attendance by visiting the meetings page.`,
    created_at: new Date().toISOString(),
  });

  return redirect("/meetings");
};

export const updateMeetingStatusAction = async (formData: FormData) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const meetingId = formData.get("meeting_id")?.toString();
  const status = formData.get("status")?.toString();

  if (!meetingId || !status) {
    return redirect("/meetings");
  }

  // Get the meeting to check permissions
  const { data: meeting } = await supabase
    .from("meetings")
    .select("*")
    .eq("id", meetingId)
    .single();

  if (!meeting) {
    return redirect("/meetings");
  }

  // Check if user is authorized to update this meeting
  if (meeting.teacher_id !== user.id && meeting.parent_id !== user.id) {
    return redirect("/meetings");
  }

  // Update meeting status
  const { error } = await supabase
    .from("meetings")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", meetingId);

  if (error) {
    console.error("Error updating meeting status:", error);
  }

  // Send notification message to the other party
  const recipientId =
    user.id === meeting.teacher_id ? meeting.parent_id : meeting.teacher_id;
  let messageSubject = "";
  let messageContent = "";

  switch (status) {
    case "confirmed":
      messageSubject = `Meeting Confirmed: ${meeting.title}`;
      messageContent = `I have confirmed my attendance for our meeting on ${new Date(meeting.meeting_date).toLocaleString()}.`;
      break;
    case "cancelled":
      messageSubject = `Meeting Cancelled: ${meeting.title}`;
      messageContent = `I regret to inform you that I need to cancel our meeting scheduled for ${new Date(meeting.meeting_date).toLocaleString()}.`;
      break;
    case "completed":
      messageSubject = `Meeting Completed: ${meeting.title}`;
      messageContent = `I've marked our meeting from ${new Date(meeting.meeting_date).toLocaleString()} as completed. Thank you for your time.`;
      break;
  }

  if (messageSubject && messageContent) {
    await supabase.from("messages").insert({
      sender_id: user.id,
      recipient_id: recipientId,
      subject: messageSubject,
      content: messageContent,
      created_at: new Date().toISOString(),
    });
  }

  return redirect(`/meetings/${meetingId}`);
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
