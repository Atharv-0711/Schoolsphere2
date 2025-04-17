"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveTeacherProfileAction } from "@/app/actions";
import ClientNavbar from "@/components/client-navbar";
import { UrlProvider } from "@/components/url-provider";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, PlusCircle, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TeacherProfile({
  searchParams,
}: {
  searchParams: Message;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    personal: {},
    professional: {},
    education: {},
    additional: {},
  });
  const [activeTab, setActiveTab] = useState("personal");
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [sectionStatus, setSectionStatus] = useState<{
    [key: string]: { status: "success" | "error" | null; message: string };
  }>({
    personal: { status: null, message: "" },
    professional: { status: null, message: "" },
    education: { status: null, message: "" },
    additional: { status: null, message: "" },
  });
  const [existingProfile, setExistingProfile] = useState<any>(null);

  // Debounce function to limit API calls
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Load user data and check if profile exists
  useEffect(() => {
    async function loadUserData() {
      try {
        const { createBrowserClient } = await import("@supabase/ssr");
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
          window.location.href = "/sign-in";
          return;
        }

        if (data.user.user_metadata?.user_role !== "teacher") {
          window.location.href = "/dashboard";
          return;
        }

        // Check if user already has a teacher profile
        const { data: teacherProfile } = await supabase
          .from("teacher_profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (teacherProfile) {
          // If profile exists but is incomplete, load it for editing
          const requiredFields = [
            "qualification",
            "experience",
            "subjects",
            "grade_levels",
            "bio",
            "professional_summary",
          ];

          const personalInfoFields = teacherProfile.personal_information || {};
          const missingPersonalFields = [
            "full_name",
            "phone",
            "address",
            "city",
            "state",
          ].some((field) => !personalInfoFields[field]);

          const hasAllRequiredFields =
            requiredFields.every((field) => teacherProfile[field]) &&
            !missingPersonalFields;

          if (hasAllRequiredFields) {
            window.location.href = "/teacher/vacancies";
            return;
          }

          // Load existing profile data
          setExistingProfile(teacherProfile);

          // Initialize form data with existing profile
          const initialFormData = {
            personal: teacherProfile.personal_information || {},
            professional: {
              professional_summary: teacherProfile.professional_summary || "",
              qualification: teacherProfile.qualification || "",
              experience: teacherProfile.experience || "",
              subjects: teacherProfile.subjects || "",
              grade_levels: teacherProfile.grade_levels || "",
              bio: teacherProfile.bio || "",
            },
            education: {
              skills: teacherProfile.skills?.join(", ") || "",
              teaching_methodologies:
                teacherProfile.teaching_methodologies?.join(", ") || "",
              classroom_management:
                teacherProfile.classroom_management_strategies?.join(", ") ||
                "",
            },
            additional: {
              lesson_planning: teacherProfile.lesson_planning || "",
              tech_proficiency:
                teacherProfile.technological_proficiency?.join(", ") || "",
              research:
                teacherProfile.research_publications
                  ?.map((p: any) => p.title)
                  .join("\n") || "",
              workshops:
                teacherProfile.workshops_training
                  ?.map((w: any) => w.name)
                  .join("\n") || "",
              extracurricular:
                teacherProfile.extracurricular_activities?.join(", ") || "",
              awards:
                teacherProfile.awards_recognitions
                  ?.map((a: any) => a.title)
                  .join("\n") || "",
              memberships:
                teacherProfile.professional_memberships
                  ?.map((m: any) => m.organization)
                  .join("\n") || "",
              references:
                teacherProfile.references
                  ?.map((r: any) => r.details)
                  .join("\n") || "",
            },
          };

          // Add education qualifications
          if (teacherProfile.educational_qualifications?.length > 0) {
            teacherProfile.educational_qualifications.forEach(
              (edu: any, index: number) => {
                initialFormData.education[`degree_${index}`] = edu.degree || "";
                initialFormData.education[`institution_${index}`] =
                  edu.institution || "";
                initialFormData.education[`year_${index}`] = edu.year || "";
                initialFormData.education[`grade_${index}`] = edu.grade || "";
              },
            );
          }

          // Add certifications
          if (teacherProfile.teaching_certifications?.length > 0) {
            teacherProfile.teaching_certifications.forEach(
              (cert: any, index: number) => {
                initialFormData.education[`cert_name_${index}`] =
                  cert.name || "";
                initialFormData.education[`cert_authority_${index}`] =
                  cert.authority || "";
                initialFormData.education[`cert_year_${index}`] =
                  cert.year || "";
              },
            );
          }

          setFormData(initialFormData);
        }

        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }

    loadUserData();
  }, []);

  // Save section data to API
  const saveSection = useCallback(async (section: string, sectionData: any) => {
    setSavingSection(section);
    setSectionStatus((prev) => ({
      ...prev,
      [section]: { status: null, message: "Saving..." },
    }));

    try {
      const response = await fetch("/api/teacher-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section,
          formData: sectionData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSectionStatus((prev) => ({
          ...prev,
          [section]: { status: "success", message: "Saved successfully" },
        }));
      } else {
        setSectionStatus((prev) => ({
          ...prev,
          [section]: {
            status: "error",
            message: data.error || "Failed to save",
          },
        }));
      }
    } catch (error) {
      console.error(`Error saving ${section} section:`, error);
      setSectionStatus((prev) => ({
        ...prev,
        [section]: { status: "error", message: "Network error" },
      }));
    } finally {
      setSavingSection(null);
    }
  }, []);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((section: string, sectionData: any) => {
      saveSection(section, sectionData);
    }, 1000),
    [saveSection],
  );

  // Handle input change and trigger save
  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev) => {
      const updatedSection = {
        ...prev[section as keyof typeof prev],
        [field]: value,
      };

      // Trigger debounced save
      debouncedSave(section, updatedSection);

      return {
        ...prev,
        [section]: updatedSection,
      };
    });
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <ClientNavbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-4xl rounded-lg border border-border bg-card p-6 shadow-sm">
          <UrlProvider>
            <form
              className="flex flex-col space-y-6"
              encType="multipart/form-data"
              action={saveTeacherProfileAction}
            >
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Teacher Profile Setup
                </h1>
                <p className="text-sm text-muted-foreground">
                  Please complete your profile to continue
                </p>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="personal">
                    Personal Information
                    {sectionStatus.personal.status === "success" && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="professional">
                    Professional Details
                    {sectionStatus.professional.status === "success" && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="education">
                    Education & Skills
                    {sectionStatus.education.status === "success" && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="additional">
                    Additional Information
                    {sectionStatus.additional.status === "success" && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Status message for current section */}
                {sectionStatus[activeTab].status && (
                  <Alert
                    className={`mt-4 ${sectionStatus[activeTab].status === "success" ? "bg-green-50" : "bg-red-50"}`}
                  >
                    {sectionStatus[activeTab].status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <AlertDescription>
                      {sectionStatus[activeTab].message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="full_name"
                        className="text-sm font-medium"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={
                          formData.personal.full_name ||
                          user?.user_metadata?.full_name ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "personal",
                            "full_name",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user?.email || ""}
                        readOnly
                        className="w-full bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="e.g. +91 9876543210"
                        value={formData.personal.phone || ""}
                        onChange={(e) =>
                          handleInputChange("personal", "phone", e.target.value)
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Your current address"
                        value={formData.personal.address || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "personal",
                            "address",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Your city"
                        value={formData.personal.city || ""}
                        onChange={(e) =>
                          handleInputChange("personal", "city", e.target.value)
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">
                        State
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        placeholder="Your state"
                        value={formData.personal.state || ""}
                        onChange={(e) =>
                          handleInputChange("personal", "state", e.target.value)
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium">
                        Country
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        type="text"
                        placeholder="Your country"
                        value={formData.personal.country || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "personal",
                            "country",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Professional Details Tab */}
                <TabsContent value="professional" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="professional_summary"
                        className="text-sm font-medium"
                      >
                        Professional Summary
                      </Label>
                      <Textarea
                        id="professional_summary"
                        name="professional_summary"
                        placeholder="Provide a brief summary of your professional background and teaching philosophy"
                        value={formData.professional.professional_summary || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "professional_summary",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="qualification"
                        className="text-sm font-medium"
                      >
                        Highest Qualification
                      </Label>
                      <Input
                        id="qualification"
                        name="qualification"
                        type="text"
                        placeholder="e.g. Master's in Education"
                        value={formData.professional.qualification || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "qualification",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="experience"
                        className="text-sm font-medium"
                      >
                        Years of Experience
                      </Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        placeholder="e.g. 5"
                        value={formData.professional.experience || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "experience",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subjects" className="text-sm font-medium">
                        Subjects
                      </Label>
                      <Input
                        id="subjects"
                        name="subjects"
                        type="text"
                        placeholder="e.g. Mathematics, Physics (comma separated)"
                        value={formData.professional.subjects || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "subjects",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="grade_levels"
                        className="text-sm font-medium"
                      >
                        Grade Levels
                      </Label>
                      <Input
                        id="grade_levels"
                        name="grade_levels"
                        type="text"
                        placeholder="e.g. 9-12"
                        value={formData.professional.grade_levels || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "grade_levels",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Professional Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about your teaching philosophy and experience"
                        value={formData.professional.bio || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "professional",
                            "bio",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full min-h-[100px]"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Education & Skills Tab */}
                <TabsContent value="education" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Educational Qualifications
                      </Label>
                      <div className="space-y-4" id="education-container">
                        <div className="p-4 border rounded-md space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="degree_0"
                                className="text-xs font-medium"
                              >
                                Degree/Certificate
                              </Label>
                              <Input
                                id="degree_0"
                                name="education_degree_0"
                                type="text"
                                placeholder="e.g. B.Ed"
                                value={formData.education.degree_0 || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "education",
                                    "degree_0",
                                    e.target.value,
                                  )
                                }
                                required
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="institution_0"
                                className="text-xs font-medium"
                              >
                                Institution
                              </Label>
                              <Input
                                id="institution_0"
                                name="education_institution_0"
                                type="text"
                                placeholder="e.g. Delhi University"
                                value={formData.education.institution_0 || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "education",
                                    "institution_0",
                                    e.target.value,
                                  )
                                }
                                required
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="year_0"
                                className="text-xs font-medium"
                              >
                                Year
                              </Label>
                              <Input
                                id="year_0"
                                name="education_year_0"
                                type="text"
                                placeholder="e.g. 2018"
                                value={formData.education.year_0 || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "education",
                                    "year_0",
                                    e.target.value,
                                  )
                                }
                                required
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="grade_0"
                                className="text-xs font-medium"
                              >
                                Grade/Percentage
                              </Label>
                              <Input
                                id="grade_0"
                                name="education_grade_0"
                                type="text"
                                placeholder="e.g. 85%"
                                value={formData.education.grade_0 || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "education",
                                    "grade_0",
                                    e.target.value,
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <input type="hidden" name="education_count" value="1" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Teaching Certifications
                      </Label>
                      <div className="space-y-4" id="certification-container">
                        <div className="p-4 border rounded-md space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="cert_name_0"
                                className="text-xs font-medium"
                              >
                                Certification Name
                              </Label>
                              <Input
                                id="cert_name_0"
                                name="cert_name_0"
                                type="text"
                                placeholder="e.g. CTET"
                                value={formData.education.cert_name_0 || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "education",
                                    "cert_name_0",
                                    e.target.value,
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="cert_authority_0"
                                className="text-xs font-medium"
                              >
                                Issuing Authority
                              </Label>
                              <Input
                                id="cert_authority_0"
                                name="cert_authority_0"
                                type="text"
                                placeholder="e.g. CBSE"
                                value={
                                  formData.education.cert_authority_0 || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "education",
                                    "cert_authority_0",
                                    e.target.value,
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="cert_year_0"
                                className="text-xs font-medium"
                              >
                                Year
                              </Label>
                              <Input
                                id="cert_year_0"
                                name="cert_year_0"
                                type="text"
                                placeholder="e.g. 2019"
                                value={formData.education.cert_year_0 || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "education",
                                    "cert_year_0",
                                    e.target.value,
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <input
                        type="hidden"
                        name="certification_count"
                        value="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills" className="text-sm font-medium">
                        Skills
                      </Label>
                      <Textarea
                        id="skills"
                        name="skills"
                        placeholder="List your skills (comma separated)"
                        value={formData.education.skills || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "education",
                            "skills",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="teaching_methodologies"
                        className="text-sm font-medium"
                      >
                        Teaching Methodologies
                      </Label>
                      <Textarea
                        id="teaching_methodologies"
                        name="teaching_methodologies"
                        placeholder="Describe your teaching methodologies (comma separated)"
                        value={formData.education.teaching_methodologies || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "education",
                            "teaching_methodologies",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="classroom_management"
                        className="text-sm font-medium"
                      >
                        Classroom Management Strategies
                      </Label>
                      <Textarea
                        id="classroom_management"
                        name="classroom_management"
                        placeholder="Describe your classroom management strategies (comma separated)"
                        value={formData.education.classroom_management || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "education",
                            "classroom_management",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Additional Information Tab */}
                <TabsContent value="additional" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="lesson_planning"
                        className="text-sm font-medium"
                      >
                        Lesson Planning & Curriculum Development
                      </Label>
                      <Textarea
                        id="lesson_planning"
                        name="lesson_planning"
                        placeholder="Describe your approach to lesson planning and curriculum development"
                        value={formData.additional.lesson_planning || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "additional",
                            "lesson_planning",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="tech_proficiency"
                        className="text-sm font-medium"
                      >
                        Technological Proficiency
                      </Label>
                      <Textarea
                        id="tech_proficiency"
                        name="tech_proficiency"
                        placeholder="List technologies you're proficient with (comma separated)"
                        value={formData.additional.tech_proficiency || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "additional",
                            "tech_proficiency",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="research" className="text-sm font-medium">
                        Research & Publications
                      </Label>
                      <Textarea
                        id="research"
                        name="research"
                        placeholder="List any research or publications (if any)"
                        value={formData.additional.research || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "additional",
                            "research",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="workshops"
                        className="text-sm font-medium"
                      >
                        Workshops & Training Attended
                      </Label>
                      <Textarea
                        id="workshops"
                        name="workshops"
                        placeholder="List workshops and training programs you've attended"
                        value={formData.additional.workshops || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "additional",
                            "workshops",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="extracurricular"
                        className="text-sm font-medium"
                      >
                        Extracurricular Activities Involvement
                      </Label>
                      <Textarea
                        id="extracurricular"
                        name="extracurricular"
                        placeholder="Describe your involvement in extracurricular activities"
                        value={formData.additional.extracurricular || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "additional",
                            "extracurricular",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="awards" className="text-sm font-medium">
                        Awards & Recognitions
                      </Label>
                      <Textarea
                        id="awards"
                        name="awards"
                        placeholder="List any awards or recognitions you've received"
                        value={formData.additional.awards || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "additional",
                            "awards",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="memberships"
                        className="text-sm font-medium"
                      >
                        Professional Memberships
                      </Label>
                      <Textarea
                        id="memberships"
                        name="memberships"
                        placeholder="List any professional organizations you're a member of"
                        value={formData.additional.memberships || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "additional",
                            "memberships",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="references"
                        className="text-sm font-medium"
                      >
                        References
                      </Label>
                      <Textarea
                        id="references"
                        name="references"
                        placeholder="Provide references (name, position, contact)"
                        value={formData.additional.references || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "additional",
                            "references",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume" className="text-sm font-medium">
                        Resume/CV (Optional)
                      </Label>
                      <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <SubmitButton pendingText="Saving profile..." className="w-full">
                Save Profile & Continue
              </SubmitButton>

              <FormMessage message={searchParams} />
            </form>
          </UrlProvider>
        </div>
      </div>
    </>
  );
}
