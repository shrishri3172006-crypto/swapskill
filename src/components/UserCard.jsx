import { useState } from 'react';
import { ArrowUpRight, Bookmark, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import RequestDialog from './RequestDialog.jsx';
import { getData, getMatchPercentage, updateData } from '../utils/storage.js';
import { useApp } from '../context/AppContext.jsx';

export default function UserCard({ person, compact = false, onFavouriteChange }) {
  const { user, setToast } = useApp();
  const [favourites, setFavourites] = useState(() => getData('favourites', {}));
  const [requestOpen, setRequestOpen] = useState(false);
  const isFavourite = (favourites[user?.id] || []).includes(person.id);
  const percentage = getMatchPercentage(user, person);
  const toggleFavourite = () => {
    const next = updateData('favourites', (current) => {
      const saved = current[user.id] || [];
      return { ...current, [user.id]: saved.includes(person.id) ? saved.filter((id) => id !== person.id) : [...saved, person.id] };
    }, {});
    setFavourites(next);
    onFavouriteChange?.(person.id, !isFavourite);
    setToast({ type: 'success', message: isFavourite ? 'Removed from your favourites.' : `${person.name.split(' ')[0]} added to favourites.` });
  };
  return (
    <article className={`user-card ${compact ? 'user-card-compact' : ''}`}>
      <div className="user-card-top">
        <Avatar user={person} size="lg" />
        <button className={`icon-button favourite-toggle ${isFavourite ? 'is-favourite' : ''}`} onClick={toggleFavourite} aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
          <Bookmark size={18} fill={isFavourite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="user-card-heading"><div><h3>{person.name}</h3><p>Computer Science student</p></div><span className="match-score">{percentage}%<small>match</small></span></div>
      <div className="user-rating"><Star size={14} fill="currentColor" /> <strong>{person.rating || '4.8'}</strong><span>·</span><span>{person.sessions || 0} sessions</span></div>
      <div className="user-skill-group"><span className="eyebrow">CAN TEACH</span><div className="tag-list">{(person.teaches || []).slice(0, 3).map((skill) => <span key={skill} className="skill-tag">{skill}</span>)}</div></div>
      {!compact && <div className="user-skill-group user-wants"><span className="eyebrow">WANTS TO LEARN</span><div className="tag-list">{(person.wants || []).slice(0, 2).map((skill) => <span key={skill} className="skill-tag skill-tag-muted">{skill}</span>)}</div></div>}
      <div className="user-card-actions">
        <Link to={`/profile/${person.id}`} className="button button-outline button-small">View profile</Link>
        <button className="button button-primary button-small" onClick={() => setRequestOpen(true)}>Connect <ArrowUpRight size={15} /></button>
      </div>
      {requestOpen && <RequestDialog person={person} onClose={() => setRequestOpen(false)} />}
    </article>
  );
}
