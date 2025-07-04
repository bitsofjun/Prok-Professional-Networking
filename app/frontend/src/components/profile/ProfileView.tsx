import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileExperience from "./ProfileExperience";
import SocialLinks from "./SocialLinks";
import { mockProfile } from "./mock/mockProfile";

const ProfileView: React.FC = () => {
  const profile = mockProfile;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ProfileHeader
        avatarUrl={profile.avatarUrl}
        name={profile.name}
        title={profile.title}
        location={profile.location}
        social={profile.social}
        onEdit={() => window.location.href = "/profile/edit"}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6 md:col-span-2">
          {/* About */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p>{profile.bio}</p>
          </div>
          {/* Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string) => (
                <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {/* Education */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Education</h2>
            {profile.education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <div className="font-semibold">{edu.degree}</div>
                <div className="text-gray-600">{edu.institution}</div>
                <div className="text-gray-400 text-sm">{edu.period}</div>
              </div>
            ))}
          </div>
          {/* Experience */}
          <ProfileExperience experience={profile.experience} />
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
            <ul>
              {profile.activity.map((act, idx) => (
                <li key={idx} className="mb-1 text-gray-700">
                  <span className="font-medium">{act.type === "post" ? "📝" : "🔗"}</span> {act.content}
                  <span className="text-gray-400 text-xs ml-2">{act.date}</span>
                </li>
              ))}
            </ul>
            <a href="#" className="text-blue-600 hover:underline text-sm">Show more activity</a>
          </div>
        </div>
        {/* Right column */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
            <div className="mb-1">{profile.contact.email}</div>
            <div className="mb-1">{profile.contact.phone}</div>
            <div className="text-gray-500">{profile.location}</div>
          </div>
          {/* Languages */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Languages</h2>
            <ul>
              <li>Tamil <span className="text-gray-400 text-xs">Native</span></li>
              <li>English <span className="text-gray-400 text-xs">Professional</span></li>
              <li>Hindi <span className="text-gray-400 text-xs">Conversational</span></li>
            </ul>
          </div>
          {/* Connections */}
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold">{profile.connections}+</div>
            <div className="text-gray-600">Connections</div>
            <div className="text-lg font-semibold mt-2">{profile.mutualConnections}</div>
            <div className="text-gray-500 text-sm">Mutual</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView; 