const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const authApi = {
  login: async (credentials: { usernameOrEmail: string; password: string }) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  signup: async (userData: { username: string; email: string; password: string }) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};

export const profileApi = {
  getProfile: async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    return response.json();
  },

  updateProfile: async (profileData: any) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },
}; 