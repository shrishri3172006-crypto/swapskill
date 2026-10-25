import { ArrowUpRight, UsersRound } from 'lucide-react';
import { skillCatalog } from '../data/initialData.js';
import { getData } from '../utils/storage.js';

export default function SkillCard({ skill, onFind }) {
  const metadata = getData('skills', skillCatalog).find((entry) => entry.name.toLowerCase() === skill.toLowerCase());
  const users = getData('users', []);
  const teachers = users.filter((user) => (user.teaches || []).some((item) => item.toLowerCase() === skill.toLowerCase()));
  const learners = users.filter((user) => (user.wants || []).some((item) => item.toLowerCase() === skill.toLowerCase()));
  return (
    <article className="skill-card">
      <div className="skill-card-head"><span className="skill-icon">{metadata?.icon || '✦'}</span><span className="skill-category">{metadata?.category || 'Other'}</span></div>
      <h3>{skill}</h3>
      <p className="skill-card-meta"><UsersRound size={15} /> {learners.length} {learners.length === 1 ? 'student' : 'students'} learning</p>
      <div className="skill-teachers">
        <div className="mini-avatars">{teachers.slice(0, 3).map((person) => <span className="mini-avatar" key={person.id}>{person.name.charAt(0)}</span>)}</div>
        <span>{teachers.length ? `${teachers.length} ${teachers.length === 1 ? 'student' : 'students'} can teach` : 'Be the first to teach'}</span>
      </div>
      <button className="text-action" onClick={() => onFind(skill)}><span>Find partners</span><ArrowUpRight size={16} /></button>
    </article>
  );
}
