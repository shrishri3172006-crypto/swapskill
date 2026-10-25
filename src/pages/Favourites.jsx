import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import UserCard from '../components/UserCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { getData } from '../utils/storage.js';

export default function Favourites() {
  const { user } = useApp();
  const [favourites, setFavourites] = useState(() => {
    const ids = getData('favourites', {})[user.id] || [];
    return getData('users', []).filter((person) => ids.includes(person.id));
  });
  const handleFavouriteChange = (personId, isFavourite) => {
    if (!isFavourite) setFavourites((current) => current.filter((person) => person.id !== personId));
  };
  return <div className="page-wrap">
    <PageHeader eyebrow="YOUR SHORTLIST" title="Favourites" description="The students you’d love to learn with, all in one place." />
    <div className="favourites-note"><Bookmark size={17} /> Keep your future study buddies close. Your favourites stay saved on this device.</div>
    {favourites.length ? <div className="user-grid match-grid">{favourites.map((person) => <UserCard key={person.id} person={person} onFavouriteChange={handleFavouriteChange} />)}</div> : <div className="empty-state"><span className="empty-icon"><Bookmark size={24} /></span><h3>Your favourites start here</h3><p>Save students you’d like to connect with from your matches.</p></div>}
  </div>;
}
