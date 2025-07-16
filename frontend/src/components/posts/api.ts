const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const postsApi = {
  createPost: async (formData: FormData) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    return response.json();
  },
};