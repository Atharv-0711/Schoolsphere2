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

  const qualification = formData.get("qualification")?.toString();
  const experience = formData.get("experience")?.toString();
  const subjects = formData.get("subjects")?.toString();
  const gradeLevels = formData.get("grade_levels")?.toString();
  const bio = formData.get("bio")?.toString();

  if (!qualification || !experience || !subjects || !gradeLevels || !bio) {
    return encodedRedirect(
      "error",
      "/teacher-profile",
      "All fields are required",
    );
  }

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
    });

  if (profileError) {
    console.error("Error saving teacher profile:", profileError);
    return encodedRedirect(
      "error",
      "/teacher-profile",
      "Failed to save profile",
    );
  }

  return redirect("/teacher/vacancies");
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

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
