const API_URL = 'http://localhost:5001/api';

export const profileApi = {
  getProfile: async () => {
    try {
      const response = await fetch(`${API_URL}/profile`);
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
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  uploadProfileImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/profile/image`, {
        method: 'POST',
        body: formData,
      });
      
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