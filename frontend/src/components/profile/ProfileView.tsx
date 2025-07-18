import React, { useEffect, useState } from "react";
import ProfileExperience from "./ProfileExperience";
import SocialLinks from "./SocialLinks";
import { profileApi } from "./api";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";

const IMAGE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();

  useEffect(() => {
    if (routerLocation.state && (routerLocation.state as any).success) {
      setSuccess((routerLocation.state as any).success);
      // Remove the state so it doesn't persist on refresh
      navigate(routerLocation.pathname, { replace: true, state: {} });
      setTimeout(() => setSuccess(null), 4000);
    }
    profileApi.getProfile()
      .then((data) => {
        if (data && data.error) {
          setError(data.error);
          setProfile(null);
        } else {
          setProfile(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!profile) return null;

  // Map backend fields to expected props
  const avatarUrl = profile.avatar ? `${IMAGE_URL}/uploads/profile_images/${profile.avatar}` : "/default-avatar.svg";
  const name = profile.name || "";
  const title = profile.title || "";
  const location = profile.location || "";
  const bio = profile.bio || "";
  const skills = profile.skills ? profile.skills.split(",").map((s: string) => s.trim()).filter((s: string) => s) : [];
  const education = Array.isArray(profile.education) ? profile.education : [];
  const experience = Array.isArray(profile.experience) ? profile.experience : [];
  const contact = profile.contact || {};
  const social = profile.social || {};
  const activity = Array.isArray(profile.activity) ? profile.activity : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-teal-100 py-10">
      {/* Profile Card */}
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 relative">
        {/* Top Right Buttons */}
        <div className="absolute top-8 right-8 flex gap-4 z-50">
          <button
            onClick={() => navigate("/profile/edit")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition-all duration-200"
          >
            Edit Profile
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow"
            onClick={() => {
              localStorage.removeItem('access_token');
              navigate('/login');
            }}
            type="button"
          >
            Logout
          </button>
        </div>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-center font-semibold shadow">
            {success}
          </div>
        )}
        {/* Banner */}
        <div className="h-32 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-teal-300 rounded-2xl mb-8 relative flex items-end">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg absolute left-8 -bottom-16 object-cover bg-white"
          />
        </div>
        <div className="pl-44">
          <h1 className="text-3xl font-extrabold text-blue-800">{name}</h1>
          <div className="text-lg text-purple-700 font-semibold">{title}</div>
          <div className="text-gray-500 flex items-center gap-2 mt-1">
            <span className="material-icons text-base">location_on</span>
            {location}
          </div>
          <div className="mt-4">
            <SocialLinks {...social} />
          </div>
        </div>
        {/* Bio */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-blue-700 mb-2">About</h2>
          <p className="text-gray-700 bg-white/60 rounded-lg p-4 shadow">{bio || "No bio yet."}</p>
        </div>
        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, idx: number) => (
                <span key={idx} className="bg-gradient-to-r from-blue-200 to-purple-200 text-blue-800 px-4 py-1 rounded-full font-semibold shadow">{skill}</span>
              ))}
            </div>
          </div>
        )}
        {/* Experience */}
        {experience.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Experience</h2>
            <ProfileExperience experience={experience} />
          </div>
        )}
        {/* Education */}
        {education.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Education</h2>
            <ul className="space-y-2">
              {education.map((edu: any, idx: number) => (
                <li key={idx} className="bg-white/60 rounded-lg p-4 shadow">
                  <div className="font-semibold text-purple-700">{edu.degree || edu.school || "Education"}</div>
                  <div className="text-gray-600">{edu.school}</div>
                  <div className="text-gray-400 text-sm">{edu.year || ""}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Contact */}
        {contact && Object.keys(contact).length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Contact</h2>
            <div className="bg-white/60 rounded-lg p-4 shadow">
              {contact.email && <div><span className="font-semibold">Email:</span> {contact.email}</div>}
              {contact.phone && <div><span className="font-semibold">Phone:</span> {contact.phone}</div>}
              {/* Add more contact fields as needed */}
            </div>
          </div>
        )}
        {/* Activity */}
        {activity.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Recent Activity</h2>
            <ul className="space-y-2">
              {activity.map((act: any, idx: number) => (
                <li key={idx} className="bg-white/60 rounded-lg p-4 shadow text-gray-700">{act}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView; 