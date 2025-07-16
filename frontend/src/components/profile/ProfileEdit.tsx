import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "./api";
import defaultAvatar from "../../assets/react.svg"; // Or your default avatar path

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
  const navigate = useNavigate();

  useEffect(() => {
    profileApi.getProfile()
      .then((data) => {
        setForm({
          name: data.name || "",
          title: data.title || "",
          location: data.location || "",
          bio: data.bio || "",
          skills: data.skills ? data.skills.split(",").map((s: string) => s.trim()).filter((s: string) => s) : [],
          education: Array.isArray(data.education) && data.education.length > 0 ? data.education : [{ ...emptyEdu }],
          experience: Array.isArray(data.experience) && data.experience.length > 0 ? data.experience : [{ ...emptyExp }],
          contact: data.contact || { ...emptyContact },
          avatar: data.avatar || "",
        });
        setAvatarPreview(data.avatar ? `${IMAGE_URL}/uploads/profile_images/${data.avatar}` : "");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

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
    (updated[idx] as EducationItem)[e.target.name as keyof EducationItem] = e.target.value;
    setForm({ ...form, education: updated });
  };

  const handleExpChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = [...form.experience];
    (updated[idx] as ExperienceItem)[e.target.name as keyof ExperienceItem] = e.target.value;
    setForm({ ...form, experience: updated });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, contact: { ...form.contact, [e.target.name]: e.target.value } });
  };

  // Add/remove education/experience
  const addEdu = () => setForm({ ...form, education: [...form.education, { ...emptyEdu }] });
  const removeEdu = (idx: number) => setForm({ ...form, education: form.education.filter((_: any, i: number) => i !== idx) });
  const addExp = () => setForm({ ...form, experience: [...form.experience, { ...emptyExp }] });
  const removeExp = (idx: number) => setForm({ ...form, experience: form.experience.filter((_: any, i: number) => i !== idx) });

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

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Sanitize all fields and ensure no undefined/null
    const payload = {
      name: form.name?.trim() || '',
      title: form.title?.trim() || '',
      location: form.location?.trim() || '',
      bio: form.bio?.trim() || '',
      skills: Array.isArray(form.skills) ? form.skills.join(", ") : '',
      education: Array.isArray(form.education) ? form.education : [],
      experience: Array.isArray(form.experience) ? form.experience : [],
      contact: form.contact ?? {},
    };

    try {
      const result = await profileApi.updateProfile(payload);
      if (result?.error) {
        setError(result.error);
      } else {
        navigate('/profile', { state: { success: 'Profile updated successfully!' } });
      }
    } catch (error: any) {
      setError(error?.message || "Failed to update profile. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-teal-100 flex items-center justify-center py-10">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 relative">
        {/* Logout Button */}
        <button
          className="absolute top-6 right-8 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow"
          onClick={() => {
            localStorage.removeItem('access_token');
            navigate('/login');
          }}
          type="button"
        >
          Logout
        </button>
        {/* Top Banner */}
        <div className="h-28 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-teal-300 rounded-2xl mb-12 relative flex items-end">
          <img
            src={avatarPreview || defaultAvatar}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg absolute left-8 -bottom-14 object-cover bg-white cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleAvatarChange}
            disabled={uploading}
          />
          {uploading && (
            <div className="absolute left-8 -bottom-14 w-28 h-28 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
              <span className="text-white text-xs">Uploading...</span>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">Edit Your Profile</h1>
        {error && <div className="text-red-600 mb-2 p-2 bg-red-50 rounded">{error}</div>}
        {success && <div className="text-green-600 mb-2 p-2 bg-green-50 rounded">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              disabled={uploading}
            />
          </div>
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              disabled={uploading}
            />
          </div>
          {/* Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
              disabled={uploading}
            />
          </div>
          {/* Bio */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              rows={3}
              disabled={uploading}
            />
          </div>
          {/* Skills */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={Array.isArray(form.skills) ? form.skills.join(", ") : ""}
              onChange={handleSkillsChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:outline-none transition"
              disabled={uploading}
            />
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
                  value={exp.company || ""}
                  onChange={e => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Role"
                  value={exp.role || ""}
                  onChange={e => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="period"
                  placeholder="Period (e.g., 2020-2023)"
                  value={exp.period || ""}
                  onChange={e => handleExpChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={exp.description || ""}
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
          {/* Education */}
          <div>
            <label className="block font-medium">Education</label>
            {form.education.map((edu, idx) => (
              <div key={idx} className="mb-2 border p-2 rounded">
                <input
                  type="text"
                  name="institution"
                  placeholder="Institution"
                  value={edu.institution || ""}
                  onChange={e => handleEduChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree"
                  value={edu.degree || ""}
                  onChange={e => handleEduChange(idx, e)}
                  className="w-full mb-1 border rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="period"
                  placeholder="Period (e.g., 2018-2022)"
                  value={edu.period || ""}
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
          {/* Contact */}
          <div>
            <label className="block font-medium">Contact Information</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.contact.email || ""}
              onChange={handleContactChange}
              className="w-full mb-1 border rounded px-2 py-1"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.contact.phone || ""}
              onChange={handleContactChange}
              className="w-full mb-1 border rounded px-2 py-1"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.contact.location || ""}
              onChange={handleContactChange}
              className="w-full mb-1 border rounded px-2 py-1"
            />
          </div>
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-300 transition"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-8 py-2 rounded-full shadow-lg hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition-all duration-200"
              disabled={uploading}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit; 