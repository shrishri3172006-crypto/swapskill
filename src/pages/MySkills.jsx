import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Check, Pencil, Plus, Sparkles, Wrench, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { addSkillsToCatalog, getData, saveData } from '../utils/storage.js';

function SkillList({ title, description, icon: Icon, skills, onAdd, onRemove, onRename, type, color }) {
  const [value, setValue] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);
  const [editValue, setEditValue] = useState('');
  const add = (event) => {
    event.preventDefault();
    if (!value.trim()) {
      onAdd(type, '');
      return;
    }
    onAdd(type, value.trim());
    setValue('');
  };
  return <section className="skills-manager-card"><div className="skills-manager-head"><span className={`skill-manager-icon ${color}`}><Icon size={20} /></span><div><h2>{title}</h2><p>{description}</p></div><span className="skill-number">{skills.length}</span></div>
    <div className="managed-skill-list">{skills.length ? skills.map((skill) => <span className={`managed-skill ${editingSkill === skill ? 'managed-skill-editing' : ''}`} key={skill}>
      {editingSkill === skill ? <form className="edit-skill-form" onSubmit={(event) => { event.preventDefault(); if (onRename(type, skill, editValue)) setEditingSkill(null); }}>
        <input value={editValue} onChange={(event) => setEditValue(event.target.value)} aria-label={`Rename ${skill}`} autoFocus />
        <button type="submit" aria-label={`Save ${skill}`}><Check size={14} /></button>
        <button type="button" aria-label={`Cancel editing ${skill}`} onClick={() => setEditingSkill(null)}><X size={14} /></button>
      </form> : <>{skill}<button aria-label={`Edit ${skill}`} onClick={() => { setEditingSkill(skill); setEditValue(skill); }}><Pencil size={12} /></button><button aria-label={`Remove ${skill}`} onClick={() => onRemove(type, skill)}><X size={14} /></button></>}
    </span>) : <span className="muted-copy">Nothing here yet — add your first skill below.</span>}</div>
    <form className="add-skill-form" onSubmit={add}><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Add a skill..." aria-label={`Add ${title.toLowerCase()}`} /><button type="submit" className="button button-outline button-small"><Plus size={15} /> Add</button></form>
  </section>;
}

export default function MySkills() {
  const { user, setUser, setToast } = useApp();
  const [progress, setProgress] = useState(() => getData('progress', {})[user.id] || {});
  const saveSkills = (teaches, wants) => {
    const updated = { ...user, teaches, wants };
    const users = getData('users', []).map((person) => person.id === user.id ? updated : person);
    saveData('users', users);
    setUser(updated);
  };
  const onAdd = (type, skill) => {
    if (!skill.trim()) return setToast({ type: 'error', message: 'Enter a skill before adding it.' });
    const current = user[type] || [];
    if (current.some((item) => item.toLowerCase() === skill.toLowerCase())) return setToast({ type: 'error', message: 'That skill is already on your list.' });
    addSkillsToCatalog([skill]);
    saveSkills(type === 'teaches' ? [...current, skill] : user.teaches || [], type === 'wants' ? [...current, skill] : user.wants || []);
    setToast({ type: 'success', message: `${skill} added to your skills.` });
  };
  const onRemove = (type, skill) => {
    const updated = (user[type] || []).filter((item) => item !== skill);
    saveSkills(type === 'teaches' ? updated : user.teaches || [], type === 'wants' ? updated : user.wants || []);
    if (type === 'wants') {
      const allProgress = getData('progress', {});
      const userProgress = { ...(allProgress[user.id] || {}) };
      delete userProgress[skill];
      const nextProgress = { ...allProgress, [user.id]: userProgress };
      saveData('progress', nextProgress);
      setProgress(userProgress);
    }
    setToast({ type: 'success', message: `${skill} removed.` });
  };
  const onRename = (type, skill, rawValue) => {
    const nextSkill = rawValue.trim();
    if (!nextSkill) {
      setToast({ type: 'error', message: 'A skill name cannot be empty.' });
      return false;
    }
    if ((user[type] || []).some((item) => item !== skill && item.toLowerCase() === nextSkill.toLowerCase())) {
      setToast({ type: 'error', message: 'That skill is already on your list.' });
      return false;
    }
    if (nextSkill === skill) return true;
    saveSkills(type === 'teaches' ? (user.teaches || []).map((item) => item === skill ? nextSkill : item) : user.teaches || [], type === 'wants' ? (user.wants || []).map((item) => item === skill ? nextSkill : item) : user.wants || []);
    addSkillsToCatalog([nextSkill]);
    if (type === 'wants') {
      const allProgress = getData('progress', {});
      const userProgress = { ...(allProgress[user.id] || {}) };
      if (userProgress[skill]) {
        userProgress[nextSkill] = userProgress[skill];
        delete userProgress[skill];
        saveData('progress', { ...allProgress, [user.id]: userProgress });
        setProgress(userProgress);
      }
    }
    setToast({ type: 'success', message: `${skill} renamed to ${nextSkill}.` });
    return true;
  };
  const updateProgress = (skill, percent) => {
    const level = percent >= 75 ? 'Advanced' : percent >= 40 ? 'Intermediate' : 'Beginner';
    const next = { ...progress, [skill]: { percent, level } };
    setProgress(next);
    const allProgress = getData('progress', {});
    saveData('progress', { ...allProgress, [user.id]: next });
  };
  const learningSkills = useMemo(() => user.wants || [], [user.wants]);
  return <div className="page-wrap">
    <PageHeader eyebrow="YOUR SKILLS, YOUR STORY" title="My skills" description="Share what you know and keep track of what you’re learning." action={<Link to="/explore" className="button button-primary"><Sparkles size={16} /> Discover skills</Link>} />
    <div className="skills-manager-grid">
      <SkillList title="I can teach" description="Skills you’re happy to share with other students." icon={Wrench} skills={user.teaches || []} onAdd={onAdd} onRemove={onRemove} onRename={onRename} type="teaches" color="manager-purple" />
      <SkillList title="I want to learn" description="What you’d love to explore next." icon={BookOpen} skills={user.wants || []} onAdd={onAdd} onRemove={onRemove} onRename={onRename} type="wants" color="manager-blue" />
    </div>
    <section className="learning-section">
      <div className="section-heading"><div><span className="eyebrow">LITTLE BY LITTLE</span><h2>Learning progress</h2><p>Update your progress as you build confidence.</p></div><span className="learning-tip"><Sparkles size={15} /> There’s no wrong pace</span></div>
      {learningSkills.length ? <div className="learning-list">{learningSkills.map((skill) => {
        const item = progress[skill] || { percent: 15, level: 'Beginner' };
        return <div className="learning-item" key={skill}><div className="learning-item-top"><div className="learning-title"><span className="learning-book"><BookOpen size={17} /></span><div><strong>{skill}</strong><span>{item.level}</span></div></div><label className="progress-input">{item.percent}%<input type="range" min="0" max="100" step="5" value={item.percent} onChange={(event) => updateProgress(skill, Number(event.target.value))} aria-label={`${skill} progress`} /></label></div><div className="progress-track progress-track-large"><span style={{ width: `${item.percent}%` }} /></div><div className="learning-milestones"><span>Just starting</span><span>Feeling confident</span></div></div>;
      })}</div> : <div className="empty-state learning-empty"><BookOpen size={25} /><h3>Make room for something new</h3><p>Add skills you want to learn to start your personal progress tracker.</p><Link to="/explore" className="button button-outline button-small">Explore skills <ArrowRight size={15} /></Link></div>}
    </section>
  </div>;
}
