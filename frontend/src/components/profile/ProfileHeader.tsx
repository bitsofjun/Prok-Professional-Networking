import React from "react";
import SocialLinks from "./SocialLinks";

interface ProfileHeaderProps {
  avatarUrl?: string;
  name: string;
  title: string;
  location: string;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  onEdit?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  name,
  title,
  location,
  social,
  onEdit,
}) => (
  <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow p-6 mb-6">
    <div className="flex items-center gap-4">
      <img
        src={avatarUrl || "/default-avatar.png"}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border"
      />
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-gray-600">{title}</p>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <span className="material-icons text-base">location_on</span>
          {location}
        </p>
        <SocialLinks {...social} />
      </div>
    </div>
    <button
      className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={onEdit}
    >
      Edit Profile
    </button>
  </div>
);

export default ProfileHeader; 