const API_URL = 'http://localhost:5001';

export const postsApi = {
  createPost: async (content: string) => {
    const response = await fetch(`