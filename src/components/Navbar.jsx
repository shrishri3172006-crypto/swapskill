import { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getData, removeData } from '../utils/storage.js';
import Avatar from './Avatar.jsx';

const topLinks = [
  ['Dashboard', '/dashboard'],
  ['Explore', '/explore'],
  ['My skills', '/my-skills'],
  ['Matches', '/matches'],
  ['Requests', '/requests'],
  ['Favourites', '/favourites'],
  ['Profile', '/profile'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, setUser, setToast } = useApp();
  const navigate = useNavigate();
  const incomingCount = getData('requests', []).filter((request) => request.to === user?.id && request.status === 'pending').length;
  const logout = () => {
    removeData('currentUser');
    setUser(null);
    setOpen(false);
    navigate('/login');
    setToast({ type: 'success', message: 'You have been logged out.' });
  };
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to={user ? '/dashboard' : '/'} className="brand" aria-label="SkillSwap home">
          <span className="brand-mark"><span /></span>
          <span>skill<span className="brand-swap">swap</span></span>
        </Link>
        <nav className={`topnav ${open ? 'topnav-open' : ''}`} aria-label="Primary navigation">
          {topLinks.map(([label, to]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `topnav-link ${isActive ? 'selected' : ''}`}>{label}</NavLink>
          ))}
          {user && <button className="topnav-link mobile-logout" onClick={logout}>Log out</button>}
        </nav>
        {user ? (
          <div className="topbar-user">
            <Link to="/requests" className="notification-button" aria-label={`${incomingCount} pending requests`}>
              <Bell size={19} />
              {incomingCount > 0 && <span className="notification-count">{incomingCount}</span>}
            </Link>
            <Link to="/profile" className="topbar-profile">
              <Avatar user={user} size="sm" />
              <span className="topbar-name">{user.name.split(' ')[0]}</span>
            </Link>
            <button className="logout-text" onClick={logout}>Log out</button>
          </div>
        ) : (
          <div className="topbar-auth"><Link to="/login" className="topnav-link">Log in</Link><Link to="/signup" className="button button-primary button-small">Get started</Link></div>
        )}
        <button className="mobile-menu-button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
