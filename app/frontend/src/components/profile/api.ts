const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const profileApi = {
  getProfile: async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if ((response.status === 401 || response.status === 422)) {
        // Only redirect if token is missing or invalid
        if (!token) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        // If token is present, return an empty profile object
        return {
          name: '', title: '', location: '', bio: '', skills: '', education: [], experience: [], contact: {}, avatar: '', social: {}, activity: []
        };
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(profileData),
      });
      if (response.status === 401 || response.status === 422) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  uploadProfileImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/api/profile/image`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });
      if (response.status === 401 || response.status === 422) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
}; 