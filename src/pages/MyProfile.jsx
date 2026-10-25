import { useState } from 'react';
import { ArrowLeft, Camera, Mail, Pencil, Save, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import PageHeader from '../components/PageHeader.jsx';
import RequestDialog from '../components/RequestDialog.jsx';
import { useApp } from '../context/AppContext.jsx';
import { addSkillsToCatalog, getData, saveData } from '../utils/storage.js';

export default function MyProfile() {
  const { id } = useParams();
  const { user, setUser, setToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, bio: user.bio || '', teaches: (user.teaches || []).join(', '), wants: (user.wants || []).join(', ') });
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [error, setError] = useState('');
  const [requestOpen, setRequestOpen] = useState(false);
  const profile = id && id !== user.id ? getData('users', []).find((person) => person.id === id) : user;
  if (!profile) return <div className="page-wrap"><Link to="/matches" className="back-link"><ArrowLeft size={16} /> Back to matches</Link><div className="empty-state"><h2>Student not found</h2><p>This profile may no longer be available.</p></div></div>;
  const editable = profile.id === user.id;
  const change = (key) => (event) => setForm((previous) => ({ ...previous, [key]: event.target.value }));
  const saveProfile = (event) => {
    event.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim()) return setError('Name and email are required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    const users = getData('users', []);
    if (users.some((person) => person.id !== user.id && person.email.toLowerCase() === form.email.trim().toLowerCase())) return setError('Another account already uses that email.');
    const parse = (value) => [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];
    const updated = { ...user, name: form.name.trim(), email: form.email.trim(), bio: form.bio.trim(), teaches: parse(form.teaches), wants: parse(form.wants), avatar };
    addSkillsToCatalog([...updated.teaches, ...updated.wants]);
    saveData('users', users.map((person) => person.id === user.id ? updated : person));
    const allProgress = getData('progress', {});
    const previousProgress = allProgress[user.id] || {};
    const nextProgress = {};
    updated.wants.forEach((skill) => {
      const previousSkill = Object.keys(previousProgress).find((item) => item.toLowerCase() === skill.toLowerCase());
      if (previousSkill) nextProgress[skill] = previousProgress[previousSkill];
    });
    saveData('progress', { ...allProgress, [user.id]: nextProgress });
    setUser(updated);
    setEditing(false);
    setToast({ type: 'success', message: 'Your profile has been updated.' });
  };
  const upload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) return setError('Choose an image smaller than 2 MB.');
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.onerror = () => setError('The selected image could not be read.');
    reader.readAsDataURL(file);
  };
  return <div className="page-wrap">
    <PageHeader eyebrow="A LITTLE ABOUT YOU" title={editable ? 'My profile' : profile.name} description={editable ? 'The person behind the skills. Make it yours.' : 'A fellow learner in the SkillSwap community.'} action={editable && !editing && <button className="button button-outline" onClick={() => setEditing(true)}><Pencil size={16} /> Edit profile</button>} />
    <div className="profile-layout">
      <aside className="profile-identity card-surface">
        <div className="profile-cover"><span>SKILLSWAP MEMBER</span></div>
        <div className="profile-identity-main"><div className="profile-avatar-wrap"><Avatar user={{ ...profile, avatar }} size="xxl" />{editable && editing && <label className="camera-button" aria-label="Change profile photo"><Camera size={15} /><input type="file" accept="image/*" onChange={upload} /></label>}</div><h2>{editing ? form.name || 'Your name' : profile.name}</h2><p><Mail size={14} /> {editing ? form.email : profile.email}</p><div className="profile-rating"><Star size={15} fill="currentColor" /> {profile.rating || '5.0'} <span>·</span> {profile.sessions || 0} skill swaps</div><span className="profile-member-pill">Student member · {profile.joined || '2025'}</span></div>
      </aside>
      <section className="profile-details card-surface">
        {editable && editing ? <form onSubmit={saveProfile} className="form-stack profile-form">
          <div className="profile-form-heading"><div><span className="eyebrow">PROFILE DETAILS</span><h2>Make yourself at home</h2></div></div>
          <label className="field-label">Full name<input value={form.name} onChange={change('name')} /></label>
          <label className="field-label">Email address<input type="email" value={form.email} onChange={change('email')} /></label>
          <label className="field-label">A little about me<textarea value={form.bio} onChange={change('bio')} rows="4" placeholder="What are you studying? What makes you curious?" /></label>
          <label className="field-label">Skills I can teach <small>Separate skills with commas</small><input value={form.teaches} onChange={change('teaches')} placeholder="e.g. Java, CSS" /></label>
          <label className="field-label">Skills I want to learn <small>Separate skills with commas</small><input value={form.wants} onChange={change('wants')} placeholder="e.g. React, Photography" /></label>
          {error && <p className="form-error">{error}</p>}
          <div className="profile-form-actions"><button type="button" className="button button-light" onClick={() => { setEditing(false); setError(''); setForm({ name: user.name, email: user.email, bio: user.bio || '', teaches: (user.teaches || []).join(', '), wants: (user.wants || []).join(', ') }); setAvatar(user.avatar || ''); }}>Cancel</button><button className="button button-primary" type="submit"><Save size={16} /> Save changes</button></div>
        </form> : <div className="profile-view"><div className="profile-form-heading"><div><span className="eyebrow">ABOUT</span><h2>A little about {profile.name.split(' ')[0]}</h2></div></div><p className="profile-bio">{profile.bio || 'This student is still writing their story.'}</p><div className="profile-skill-block"><h3>Can teach</h3><div className="tag-list">{(profile.teaches || []).length ? profile.teaches.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>) : <span className="muted-copy">No skills listed yet</span>}</div></div><div className="profile-skill-block"><h3>Wants to learn</h3><div className="tag-list">{(profile.wants || []).length ? profile.wants.map((skill) => <span className="skill-tag skill-tag-muted" key={skill}>{skill}</span>) : <span className="muted-copy">No learning goals listed yet</span>}</div></div>        {!editable && <button className="button button-primary" onClick={() => setRequestOpen(true)}>Connect with {profile.name.split(' ')[0]}</button>}</div>}
      </section>
    </div>
    {requestOpen && <RequestDialog person={profile} onClose={() => setRequestOpen(false)} />}
  </div>;
}
