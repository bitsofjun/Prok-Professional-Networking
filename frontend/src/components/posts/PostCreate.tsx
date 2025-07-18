import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE_MB = 10;

const PostCreate: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [allowComments, setAllowComments] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError('File size exceeds 10MB.');
      return;
    }
    setMedia(file);
    setError(null);
    setMediaPreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    multiple: false,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    if (media && media.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError('File size exceeds 10MB.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', `<h2>${title}</h2>\n${content}`); // Combine title and content for backend
      if (media) formData.append('media', media);
      formData.append('is_public', isPublic ? 'true' : 'false');
      formData.append('allow_comments', allowComments ? 'true' : 'false');
      const token = localStorage.getItem('access_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to create post.');
      } else {
        window.location.href = '/posts';
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Post</h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </button>
            <button
              type="submit"
              form="post-create-form"
              className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
        <form id="post-create-form" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter post title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <ReactQuill
              value={content}
              onChange={setContent}
              className="bg-white"
              placeholder="Write your post..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Media</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
            >
              <input {...getInputProps()} />
              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V8a4 4 0 018 0v8m-4 4v-4m0 0H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-6z" /></svg>
              <p className="text-gray-500">Drag and drop files here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">Supports images and videos up to 10MB</p>
              {mediaPreview && (
                <div className="mt-4">
                  {media?.type.startsWith('image') ? (
                    <img src={mediaPreview} alt="Preview" className="max-h-40 rounded" />
                  ) : (
                    <video src={mediaPreview} controls className="max-h-40 rounded" />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-8 mt-4">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox mr-2"
                  checked={allowComments}
                  onChange={e => setAllowComments(e.target.checked)}
                />
                Allow Comments
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox mr-2"
                  checked={isPublic}
                  onChange={e => setIsPublic(e.target.checked)}
                />
                Public Post
              </label>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </div>
      {/* Preview Modal/Section */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPreview(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Post Preview</h3>
            <div className="mb-2 text-xl font-semibold">{title}</div>
            <div className="mb-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
            {mediaPreview && (
              <div className="mb-4">
                {media?.type.startsWith('image') ? (
                  <img src={mediaPreview} alt="Preview" className="max-h-60 rounded" />
                ) : (
                  <video src={mediaPreview} controls className="max-h-60 rounded" />
                )}
              </div>
            )}
            <div className="flex gap-4 text-sm text-gray-600">
              <span>{allowComments ? 'Comments Allowed' : 'Comments Disabled'}</span>
              <span>{isPublic ? 'Public' : 'Private'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCreate; 