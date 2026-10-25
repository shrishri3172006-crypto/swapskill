import { NavLink, useNavigate } from 'react-router-dom';
import { Bookmark, Compass, LayoutDashboard, LogOut, MessageSquare, UserRound, Users, Wrench } from 'lucide-react';
import { removeData } from '../utils/storage.js';
import { useApp } from '../context/AppContext.jsx';

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/explore', label: 'Explore skills', icon: Compass },
  { to: '/my-skills', label: 'My skills', icon: Wrench },
  { to: '/matches', label: 'My matches', icon: Users },
  { to: '/requests', label: 'Requests', icon: MessageSquare },
  { to: '/favourites', label: 'Favourites', icon: Bookmark },
  { to: '/profile', label: 'My profile', icon: UserRound },
];

export default function Sidebar() {
  const { setUser, setToast } = useApp();
  const navigate = useNavigate();
  const logout = () => {
    removeData('currentUser');
    setUser(null);
    navigate('/login');
    setToast({ type: 'success', message: 'You have been logged out.' });
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-section-label">WORKSPACE</div>
      <nav aria-label="Main navigation" className="sidebar-links">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            {label === 'Requests' && <span className="sidebar-dot" />}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-promo">
          <span className="promo-spark">✦</span>
          <strong>Grow together</strong>
          <p>Every skill you share makes someone’s next step possible.</p>
        </div>
        <button className="sidebar-link sidebar-logout" onClick={logout}><LogOut size={18} /><span>Log out</span></button>
      </div>
    </aside>
  );
}
