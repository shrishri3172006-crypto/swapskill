import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function NotFound() {
  const { user } = useApp();
  return <div className="not-found"><span className="not-found-mark">404</span><span className="eyebrow">A LITTLE OFF THE MAP</span><h1>Looks like this page took a study break.</h1><p>The link may have moved, or the page may not exist.</p><Link to={user ? '/dashboard' : '/login'} className="button button-primary"><ArrowLeft size={16} /> Back to {user ? 'dashboard' : 'login'}</Link></div>;
}
