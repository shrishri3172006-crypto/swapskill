import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { getCurrentUser, initializeStorage } from './utils/storage.js';
import Dashboard from './pages/Dashboard.jsx';
import ExploreSkills from './pages/ExploreSkills.jsx';
import Favourites from './pages/Favourites.jsx';
import Login from './pages/Login.jsx';
import Matches from './pages/Matches.jsx';
import MyProfile from './pages/MyProfile.jsx';
import MySkills from './pages/MySkills.jsx';
import NotFound from './pages/NotFound.jsx';
import Requests from './pages/Requests.jsx';
import Signup from './pages/Signup.jsx';

function GuestRoute({ children }) {
  const { user } = useApp();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  const [initialUser, setInitialUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initializeStorage();
    setInitialUser(getCurrentUser());
    setReady(true);
  }, []);
  if (!ready) return <div className="app-loading" role="status"><span className="loading-spinner" /><span>Getting your SkillSwap space ready…</span></div>;
  return <AppProvider initialUser={initialUser}>
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<ExploreSkills />} />
          <Route path="/my-skills" element={<MySkills />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/profile/:id" element={<MyProfile />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AppProvider>;
}
