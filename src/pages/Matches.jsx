import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import UserCard from '../components/UserCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { getData, getMatchPercentage } from '../utils/storage.js';

export default function Matches() {
  const { user } = useApp();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('best');
  const [params] = useSearchParams();
  const skill = params.get('skill');
  const matches = useMemo(() => {
    const list = getData('users', []).filter((person) => person.id !== user.id).map((person) => ({ person, score: getMatchPercentage(user, person) }));
    const filtered = list.filter(({ person }) => {
      const teachesWanted = (person.teaches || []).some((item) => (user.wants || []).some((wanted) => wanted.toLowerCase() === item.toLowerCase()));
      const teachesFilter = !skill || (person.teaches || []).some((item) => item.toLowerCase() === skill.toLowerCase());
      return (skill ? teachesFilter : teachesWanted) && `${person.name} ${(person.teaches || []).join(' ')}`.toLowerCase().includes(query.toLowerCase().trim());
    });
    return filtered.sort((a, b) => sortBy === 'rating' ? (b.person.rating || 0) - (a.person.rating || 0) : b.score - a.score);
  }, [user, skill, query, sortBy]);
  return <div className="page-wrap">
    <PageHeader eyebrow="GOOD THINGS ARE BETTER SHARED" title="Your matches" description="People who can teach what you’re excited to learn." />
    <div className="match-summary"><span className="match-summary-icon"><Sparkles size={18} /></span><div><strong>{matches.length} {matches.length === 1 ? 'student is' : 'students are'} a great fit for you</strong><p>Based on skills you want to learn and what they can teach.</p></div><span className="match-summary-stat">{user.wants?.length || 0}<small>skills to learn</small></span></div>
    {!user.wants?.length && <div className="notice-banner">Add a few skills you’d like to learn on <Link to="/my-skills">My skills</Link> to get personalized matches.</div>}
    <div className="match-controls"><label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students or skills" aria-label="Search students or skills" /></label><label className="select-control"><SlidersHorizontal size={16} /><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort matches"><option value="best">Best match</option><option value="rating">Top rated</option></select></label></div>
    <div className="match-result-caption">{skill ? `Students who can teach ${skill}` : 'YOUR STUDY BUDDIES'} <span> · {matches.length} results</span></div>
    {matches.length ? <div className="user-grid match-grid">{matches.map(({ person }) => <UserCard key={person.id} person={person} />)}</div> : <div className="empty-state"><span className="empty-icon">✦</span><h3>{query ? 'No matches for that search' : 'Your matches are just getting started'}</h3><p>{query ? 'Try a different name or skill.' : 'When someone teaches a skill you want to learn, they’ll show up here.'}</p>{query && <button className="button button-outline button-small" onClick={() => setQuery('')}>Clear search</button>}</div>}
  </div>;
}
