import { ArrowRight, ArrowUpRight, BookOpen, Compass, Sparkles, TrendingUp, Users, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import PageHeader from '../components/PageHeader.jsx';
import UserCard from '../components/UserCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { getData, getMatchPercentage } from '../utils/storage.js';

function ProgressMini({ user }) {
  const progressData = getData('progress', {});
  const skills = user.wants || [];
  return <div className="progress-panel">
    <div className="section-heading"><div><span className="eyebrow">YOUR LEARNING JOURNEY</span><h2>Progress in motion</h2></div><Link to="/my-skills" className="text-action">View all <ArrowRight size={16} /></Link></div>
    {skills.length ? skills.slice(0, 3).map((skill) => {
      const item = (progressData[user.id] || {})[skill] || { percent: 15, level: 'Beginner' };
      return <div className="progress-row" key={skill}><div className="progress-row-label"><span>{skill}</span><span>{item.level || 'Beginner'} <strong>{item.percent || 0}%</strong></span></div><div className="progress-track"><span style={{ width: `${item.percent || 0}%` }} /></div></div>;
    }) : <div className="empty-inline">Add a skill you want to learn to start tracking your progress.</div>}
  </div>;
}

export default function Dashboard() {
  const { user } = useApp();
  const users = getData('users', []).filter((person) => person.id !== user.id);
  const matches = users.map((person) => ({ person, score: getMatchPercentage(user, person) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
  const requests = getData('requests', [])
    .filter((request) => request.to === user.id || request.from === user.id)
    .sort((first, second) => Date.parse(second.createdAt || 0) - Date.parse(first.createdAt || 0))
    .slice(0, 3);
  const stats = [
    { label: 'Skills I teach', count: user.teaches?.length || 0, icon: Wrench, color: 'purple', to: '/my-skills' },
    { label: 'Skills to learn', count: user.wants?.length || 0, icon: BookOpen, color: 'peach', to: '/my-skills' },
    { label: 'Great matches', count: matches.length, icon: Users, color: 'blue', to: '/matches' },
    { label: 'Pending requests', count: getData('requests', []).filter((request) => request.to === user.id && request.status === 'pending').length, icon: Sparkles, color: 'green', to: '/requests' },
  ];
  return <div className="page-wrap">
    <PageHeader eyebrow={`${new Date().toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase()}, MAKE IT COUNT`} title={`Welcome back, ${user.name.split(' ')[0]}.`} description="Your next great skill swap could be just around the corner." action={<Link to="/explore" className="button button-primary"><Compass size={16} /> Explore skills</Link>} />
    <div className="dashboard-banner"><div><span className="banner-eyebrow"><Sparkles size={14} /> THIS WEEK’S NUDGE</span><h2>Teach one thing.<br /><em>Learn a whole lot.</em></h2><p>Small exchanges can lead to big breakthroughs.</p><Link to="/matches" className="banner-link">Find your next study buddy <ArrowRight size={16} /></Link></div><div className="banner-art"><div className="banner-blob blob-a" /><div className="banner-blob blob-b" /><div className="banner-card"><span>✳</span><strong>knowledge<br />is better shared</strong><small>skill / swap</small></div><div className="banner-sparkle">✦</div></div></div>
    <div className="stats-grid">{stats.map(({ label, count, icon: Icon, color, to }) => <Link className="stat-card" key={label} to={to}><span className={`stat-icon ${color}`}><Icon size={19} /></span><span className="stat-count">{count}</span><span className="stat-label">{label}</span><ArrowUpRight className="stat-arrow" size={16} /></Link>)}</div>
    <section className="dashboard-section"><div className="section-heading"><div><span className="eyebrow">GOOD THINGS HAPPEN HERE</span><h2>Picked for you</h2><p>Students whose skills line up with your curiosity.</p></div><Link to="/matches" className="text-action">See all matches <ArrowRight size={16} /></Link></div>
      {matches.length ? <div className="user-grid">{matches.slice(0, 3).map(({ person }) => <UserCard person={person} key={person.id} compact />)}</div> : <div className="empty-state compact-empty"><span>✦</span><h3>Your next match is waiting</h3><p>Add skills you’d like to learn so we can find the right people.</p><Link to="/my-skills" className="button button-outline button-small">Add learning skills</Link></div>}
    </section>
    <div className="dashboard-bottom">
      <section className="dashboard-section requests-preview"><div className="section-heading"><div><span className="eyebrow">KEEP THE CONVERSATION GOING</span><h2>Recent requests</h2></div><Link to="/requests" className="text-action">All requests <ArrowRight size={16} /></Link></div>
        {requests.length ? <div className="request-list">{requests.map((request) => {
          const person = users.find((entry) => entry.id === (request.to === user.id ? request.from : request.to));
          return <div className="mini-request" key={request.id}><Avatar user={person} size="sm" /><div><strong>{person?.name || 'Student'}</strong><span>{request.skill} exchange · {request.status}</span></div><span className={`status-dot status-dot-${request.status}`} /></div>;
        })}</div> : <div className="empty-inline">No requests yet. Your future study buddies are out there.</div>}
      </section>
      <ProgressMini user={user} />
    </div>
    <div className="dashboard-footer-note"><TrendingUp size={16} /> <span>Learning out loud makes it stick. You’re doing great, {user.name.split(' ')[0]}.</span></div>
  </div>;
}
