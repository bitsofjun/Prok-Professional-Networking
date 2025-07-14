import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';
import PostCreate from '../components/posts/PostCreate';
import PostList from '../components/posts/PostList';
import JobList from '../components/job-board/JobList';
import MessageList from '../components/messaging/MessageList';
import Navbar from '../components/navigation/Navbar';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation(); // Get current route

  // Hide Navbar on login page
  const hideNavbar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {user && !hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // Navbar will be shown on all pages
    children: [
      { path: '', element: <Login /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'profile', element: <ProfileView /> },
      { path: 'profile/edit', element: <ProfileEdit /> },
      { path: 'posts/create', element: <PostCreate /> },
      { path: 'posts', element: <PostList showMedia={false} /> },
      { path: 'feed', element: <PostList showMedia={true} /> },
      { path: 'jobs', element: <JobList /> },
      { path: 'messages', element: <MessageList /> },
    ],
  },
]); 