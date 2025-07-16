import React, { useRef, useState } from "react";

const defaultAvatar = "/default-avatar.svg";

interface EducationItem {
  institution: string;
  degree: string;
  period: string;
}

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
}

interface FormData {
  name: string;
  title: string;
  location: string;
  bio: string;
  skills: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  avatar: File | string;
}

interface FormErrors {
  name?: string;
  title?: string;
  bio?: string;
}

const emptyEdu: EducationItem = { institution: "", degree: "", period: "" };
const emptyExp: ExperienceItem = { company: "", role: "", period: "", description: "" };

const CompleteProfile: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    title: "",
    location: "",
    bio: "",
    skills: "",
    education: [{ ...emptyEdu }],
    experience: [{ ...emptyExp }],
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle skills (comma-separated)
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, skills: e.target.value });
  };

  // Education handlers
  const handleEduChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...form.education];
    updated[idx][e.target.name as keyof EducationItem] = e.target.value;
    setForm({ ...form, education: updated });
  };
  
  const addEdu = () =>
    setForm({ ...form, education: [...form.education, { ...emptyEdu }] });
  
  const removeEdu = (idx: number) =>
    setForm({
      ...form,
      education: form.education.filter((_, i) => i !== idx),
    });

  // Experience handlers
  const handleExpChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = [...form.experience];
    updated[idx][e.target.name as keyof ExperienceItem] = e.target.value;
    setForm({ ...form, experience: updated });
  };
  
  const addExp = () =>
    setForm({ ...form, experience: [...form.experience, { ...emptyExp }] });
  
  const removeExp = (idx: number) =>
    setForm({
      ...form,
      experience: form.experience.filter((_, i) => i !== idx),
    });

  // Profile photo upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
      setForm({ ...form, avatar: file });
    }
  };

  // Validate required fields
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.title.trim()) newErrors.title = "Professional Title is required";
    if (!form.bio.trim()) newErrors.bio = "Professional Summary is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Submit logic here
    alert("Profile submitted! (Implement your submit logic)");
  };

  // Logout handler
  const handleLogout = () => {
    // Implement your logout logic
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      {/* Top Banner */}
      <div className="w-full max-w-2xl bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-1">
          Welcome! Let's set up your professional profile
        </h2>
        <p className="text-blue-700 text-sm">
          Complete your profile to connect with other professionals and showcase your skills and experience.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6 relative">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>

        {/* Profile Image and Upload */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={avatarPreview || defaultAvatar}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: "pointer" }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="text-white text-xs">Uploading...</div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleAvatarChange}
              disabled={uploading}
            />
          </div>
          <span className="text-gray-600 text-sm">Click photo to change</span>
        </div>

        {/* Profile Form */}
        <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div>
            <label className="block font-medium">Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your full name"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          
          {/* Professional Title */}
          <div>
            <label className="block font-medium">Professional Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., Software Engineer, Marketing Manager, Student"
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          
          {/* Location */}
          <div>
            <label className="block font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., San Francisco, CA or Remote"
            />
          </div>
          
          {/* Professional Summary */}
          <div>
            <label className="block font-medium">Professional Summary *</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Tell us about your professional background, goals, and what you're passionate about..."
              required
            />
            {errors.bio && (
              <p className="text-red-500 text-sm">{errors.bio}</p>
            )}
          </div>
          
          {/* Skills & Expertise */}
          <div>
            <label className="block font-medium">Skills & Expertise</label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleSkillsChange}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., JavaScript, Python, React, Project Management, Leadership"
            />
          </div>
          
          {/* Education Section */}
          <div>
            <label className="block font-medium">Education</label>
            {form.education.map((edu, idx) => (
              <div key={idx} className="mb-2 border p-2 rounded">
                <input
                  type="text"
                  name="institution"
                  placeholder="School/University name"
                  value={edu.institution}
                  onChange={(e) => handleEduChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree (e.g., Bachelor's in Computer Science)"
                  value={edu.degree}
                  onChange={(e) => handleEduChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="period"
                  placeholder="Graduation year (e.g., 2023) or Years attended (e.g., 2019-2023)"
                  value={edu.period}
                  onChange={(e) => handleEduChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                {form.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEdu(idx)}
                    className="text-red-600 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addEdu}
              className="text-blue-600 text-xs"
            >
              + Add Education
            </button>
          </div>
          
          {/* Work Experience Section */}
          <div>
            <label className="block font-medium">Work Experience</label>
            {form.experience.map((exp, idx) => (
              <div key={idx} className="mb-2 border p-2 rounded">
                <input
                  type="text"
                  name="company"
                  placeholder="Company/Organization name"
                  value={exp.company}
                  onChange={(e) => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Job title/Position"
                  value={exp.role}
                  onChange={(e) => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="period"
                  placeholder="Employment period (e.g., 2020-2023 or Present)"
                  value={exp.period}
                  onChange={(e) => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <textarea
                  name="description"
                  placeholder="Describe your role, achievements, and responsibilities..."
                  value={exp.description}
                  onChange={(e) => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                  rows={2}
                />
                {form.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExp(idx)}
                    className="text-red-600 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addExp}
              className="text-blue-600 text-xs"
            >
              + Add Experience
            </button>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile; 