import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
}

interface ProfileExperienceProps {
  experience: ExperienceItem[];
}

const ProfileExperience: React.FC<ProfileExperienceProps> = ({ experience }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if user is actually authenticated
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/profile');
    }
  }, [navigate]);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Work Experience</h2>
      <div className="space-y-2">
        {experience.map((item, idx) => (
          <div key={idx} className="border rounded overflow-hidden">
            <button
              className="w-full flex justify-between items-center px-4 py-2 text-left focus:outline-none focus:bg-blue-50 hover:bg-blue-50"
              onClick={() => toggle(idx)}
              aria-expanded={openIndex === idx}
            >
              <span>
                <span className="font-bold text-gray-800">{item.role}</span> at <span className="text-gray-600">{item.company}</span>
                <span className="block text-xs text-gray-400">{item.period}</span>
              </span>
              <svg className={`w-5 h-5 transform transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {openIndex === idx && (
              <div className="px-4 pb-4 text-gray-700 animate-fade-in">
                <p>{item.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileExperience; 