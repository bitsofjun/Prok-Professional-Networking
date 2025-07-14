
import React, { useEffect, useState } from "react";
import { feedApi } from "../feed/api";

interface Post {
  id: number;
  user_id: number;
  name?: string;
  title?: string;
  avatar?: string;
  content: string;
  media_url?: string;
  created_at?: string;
}

interface PostListProps {
  showMedia?: boolean;
}

const IMAGE_URL = "http://localhost:5001";

function stripHtml(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const PostList: React.FC<PostListProps> = ({ showMedia = true }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    feedApi.getFeed()
      .then((data) => {
        const posts = Array.isArray(data) ? data : (data.feed || data.posts || []);
        setPosts(posts);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load posts");
        setLoading(false);
      });
  }, []);

  // Filter posts by search query (case-insensitive, matches content)
  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow p-8 text-lg text-gray-600">Loading feed...</div>
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow p-8 text-lg text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-teal-100 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 shadow focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>
        {/* Feed Cards */}
        {filteredPosts.length === 0 ? (
          <div className="text-center text-gray-500">No posts found.</div>
        ) : (
          filteredPosts.map(post => (
            <div
              key={post.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 transition-transform hover:scale-105 hover:shadow-2xl"
            >
              {/* Avatar and Username Row */}
              <div className="flex items-center mb-4">
                <img
                  src={
                    post.avatar
                      ? `${IMAGE_URL}/uploads/profile_images/${post.avatar}`
                      : "/default-avatar.svg"
                  }
                  alt="avatar"
                  className="w-12 h-12 rounded-full border-2 border-blue-400 mr-3 object-cover"
                />
                <div>
                  <div className="font-bold text-lg text-blue-800">{post.name || "User"}</div>
                  <div className="text-xs text-gray-400">{post.created_at && new Date(post.created_at).toLocaleString()}</div>
                </div>
              </div>
              {/* Title */}
              <div className="text-2xl font-extrabold text-gray-900 mb-2">
                {/* Extract title from content if you store it separately, or parse from content */}
                {stripHtml(post.content).split('\n')[0]}
              </div>
              {/* Content */}
              <div className="text-gray-800 mb-2">
                {/* Show the rest of the content, skipping the first line if it's the title */}
                {stripHtml(post.content).split('\n').slice(1).join('\n')}
              </div>
              {/* Media */}
              {showMedia && post.media_url && (
                <img
                  src={post.media_url.startsWith("http") ? post.media_url : `${IMAGE_URL}${post.media_url}`}
                  alt="media"
                  className="rounded-lg mt-2 max-h-80 object-cover mx-auto"
                />
              )}
              {/* Buttons */}
              <div className="flex space-x-4 mt-4">
                <button className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold shadow hover:bg-blue-200 transition">Like</button>
                <button className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full font-semibold shadow hover:bg-purple-200 transition">Comment</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostList; 