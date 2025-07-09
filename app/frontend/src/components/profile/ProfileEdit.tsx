import React, { useEffect, useState, useRef } from "react";
import { profileApi } from "./api";

const IMAGE_URL = "http://localhost:5001";

type EducationItem = { institution: string; degree: string; period: string };
type ExperienceItem = { company: string; role: string; period: string; description: string };
type ContactInfo = { email: string; phone: string; location: string };

const emptyEdu: EducationItem = { institution: "", degree: "", period: "" };
const emptyExp: ExperienceItem = { company: "", role: "", period: "", description: "" };
const emptyContact: ContactInfo = { email: "", phone: "", location: "" };

const ProfileEdit: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    title: "",
    location: "",
    bio: "",
    skills: [] as string[],
    education: [ { ...emptyEdu } ],
    experience: [ { ...emptyExp } ],
    contact: { ...emptyContact },
    avatar: ""
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await profileApi.getProfile();
      
      if (data.error) {
        setError(data.error);
      } else {
        setForm({
          name: data.name || "",
          title: data.title || "",
          location: data.location || "",
          bio: data.bio || "",
          skills: data.skills ? data.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
          education: data.education && data.education.length ? data.education : [ { ...emptyEdu } ],
          experience: data.experience && data.experience.length ? data.experience : [ { ...emptyExp } ],
          contact: data.contact || { ...emptyContact },
          avatar: data.avatar || ""
        });
        setAvatarPreview(data.avatar ? `${IMAGE_URL}/uploads/profile_images/${data.avatar}` : "");
      }
    } catch (error) {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handle simple field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle skills
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s) });
  };

  // Handle education/experience/contact changes
  const handleEduChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...form.education];
    (updated[idx] as EducationItem)[e.target.name] = e.target.value;
    setForm({ ...form, education: updated });
  };

  const handleExpChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = [...form.experience];
    (updated[idx] as ExperienceItem)[e.target.name] = e.target.value;
    setForm({ ...form, experience: updated });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, contact: { ...form.contact, [e.target.name]: e.target.value } });
  };

  // Add/remove education/experience
  const addEdu = () => setForm({ ...form, education: [...form.education, { ...emptyEdu }] });
  const removeEdu = (idx: number) => setForm({ ...form, education: form.education.filter((_, i) => i !== idx) });
  const addExp = () => setForm({ ...form, experience: [...form.experience, { ...emptyExp }] });
  const removeExp = (idx: number) => setForm({ ...form, experience: form.experience.filter((_, i) => i !== idx) });

  // Profile photo upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, PNG, GIF)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      try {
        setUploading(true);
        setError("");
        setSuccess("");

        const result = await profileApi.uploadProfileImage(file);
        
        if (result.error) {
          setError(result.error);
        } else {
          setForm(prev => ({ ...prev, avatar: result.filename }));
          setAvatarPreview(`${IMAGE_URL}${result.image_url}`);
          setSuccess("Profile photo updated successfully!");
        }
      } catch (error) {
        setError("Failed to upload image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: form.name,
        title: form.title,
        location: form.location,
        bio: form.bio,
        skills: form.skills.join(", "),
        education: form.education,
        experience: form.experience,
        contact: form.contact,
      };

      const result = await profileApi.updateProfile(payload);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Profile updated successfully!");
        await loadProfile();
      }
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatarPreview || "/default-avatar.svg"}
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
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Logout</button>
        </div>
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        {error && <div className="text-red-600 mb-2 p-2 bg-red-50 rounded">{error}</div>}
        {success && <div className="text-green-600 mb-2 p-2 bg-green-50 rounded">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Professional Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., Software Engineer, Marketing Manager"
            />
          </div>
          <div>
            <label className="block font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., San Francisco, CA"
            />
          </div>
          <div>
            <label className="block font-medium">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block font-medium">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={form.skills.join(", ")}
              onChange={handleSkillsChange}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., JavaScript, Python, React"
            />
          </div>
          {/* Education */}
          <div>
            <label className="block font-medium">Education</label>
            {form.education.map((edu, idx) => (
              <div key={idx} className="mb-2 border p-2 rounded">
                <input
                  type="text"
                  name="institution"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={e => handleEduChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={e => handleEduChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="period"
                  placeholder="Period (e.g., 2018-2022)"
                  value={edu.period}
                  onChange={e => handleEduChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                {form.education.length > 1 && (
                  <button type="button" onClick={() => removeEdu(idx)} className="text-red-600 text-xs">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addEdu} className="text-blue-600 text-xs">+ Add Education</button>
          </div>
          {/* Experience */}
          <div>
            <label className="block font-medium">Work Experience</label>
            {form.experience.map((exp, idx) => (
              <div key={idx} className="mb-2 border p-2 rounded">
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={exp.company}
                  onChange={e => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  value={exp.role}
                  onChange={e => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="period"
                  placeholder="Period (e.g., 2020-2023)"
                  value={exp.period}
                  onChange={e => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={exp.description}
                  onChange={e => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                  rows={2}
                />
                {form.experience.length > 1 && (
                  <button type="button" onClick={() => removeExp(idx)} className="text-red-600 text-xs">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addExp} className="text-blue-600 text-xs">+ Add Experience</button>
          </div>
          {/* Contact */}
          <div>
            <label className="block font-medium">Contact Information</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.contact.email}
              onChange={handleContactChange}
              className="w-full mb-1 border rounded px-2 py-1"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.contact.phone}
              onChange={handleContactChange}
              className="w-full mb-1 border rounded px-2 py-1"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.contact.location}
              onChange={handleContactChange}
              className="w-full mb-1 border rounded px-2 py-1"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit; 