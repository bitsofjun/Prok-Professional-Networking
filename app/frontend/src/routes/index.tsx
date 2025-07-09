import { createBrowserRouter, Outlet } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';
import PostCreate from '../components/posts/PostCreate';
import PostList from '../components/posts/PostList';
import Feed from '../components/feed/Feed';
import JobList from '../components/job-board/JobList';
import MessageList from '../components/messaging/MessageList';
import Navbar from '../components/navigation/Navbar';

const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

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
      { path: 'posts', element: <PostList /> },
      { path: 'feed', element: <Feed /> },
      { path: 'jobs', element: <JobList /> },
      { path: 'messages', element: <MessageList /> },
    ],
  },
]); 