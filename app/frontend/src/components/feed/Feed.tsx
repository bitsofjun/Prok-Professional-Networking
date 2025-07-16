import React, { useEffect, useState } from 'react';
import { profileApi } from "../profile/api";
import { useNavigate } from 'react-router-dom'; // Added for navigation

export interface Profile {
  name: string;
  title: string;
  location: string;
  bio: string;
  skills: string;
  education: any[];
  experience: any[];
  avatar: string;
  // add other fields as needed
}

interface CompleteProfileProps {
  onComplete: (profile: Profile) => void;
}

const CompleteProfile: React.FC<CompleteProfileProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    profileApi.getProfile().then((data: Profile) => {
      if (!data.name && !data.title && !data.bio) {
        // New user: set blank form
        setProfile({
          name: "",
          title: "",
          location: "",
          bio: "",
          skills: "",
          education: [],
          experience: [],
          avatar: "",
        });
      } else {
        // Existing user: prefill form
        setProfile({
          name: data.name || "",
          title: data.title || "",
          location: data.location || "",
          bio: data.bio || "",
          skills: data.skills || "",
          education: data.education || [],
          experience: data.experience || [],
          avatar: data.avatar || "",
        });
      }
      onComplete(data);
    });
  }, [onComplete]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>Complete Your Profile</h2>
      <p>Your profile is incomplete. Please fill in your details.</p>
      <p>Full Name: {profile.name}</p>
      <p>Professional Title: {profile.title}</p>
      <p>Professional Summary: {profile.bio}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

interface ProfileViewProps {
  profile: Profile;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  return (
    <div>
      <h2>Your Profile</h2>
      <p>Full Name: {profile.name}</p>
      <p>Professional Title: {profile.title}</p>
      <p>Professional Summary: {profile.bio}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

const Feed: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    profileApi.getProfile().then((profile) => {
      if (!profile.name && !profile.title && !profile.bio) {
        navigate('/profile/edit');
        return; // Prevent further execution
      }
      setProfile(profile);
    });
  }, [navigate]);

  if (!profile) return <div>Loading...</div>;

  // Define what "incomplete" means for your app
  const isIncomplete =
    !profile ||
    !profile.name ||
    !profile.title ||
    !profile.bio;

  return isIncomplete ? (
    <CompleteProfile onComplete={setProfile} />
  ) : (
    <ProfileView profile={profile} />
  );
};

export default Feed;