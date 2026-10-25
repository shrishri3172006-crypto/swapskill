import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { addSkillsToCatalog, getData, saveData } from '../utils/storage.js';
import Avatar from '../components/Avatar.jsx';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', teaches: '', wants: '' });
  const [avatar, setAvatar] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const { setToast } = useApp();
  const navigate = useNavigate();
  const update = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));
  const uploadAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      setError('Choose an image smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.onerror = () => setError('The selected image could not be read.');
    reader.readAsDataURL(file);
  };
  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (Object.values(form).some((value) => !value.trim())) return setError('Please complete every field to create your profile.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Use at least 6 characters for your password.');
    if (form.password !== form.confirm) return setError('Your passwords don’t match yet.');
    const users = getData('users', []);
    if (users.some((person) => person.email.toLowerCase() === form.email.trim().toLowerCase())) return setError('An account with that email already exists.');
    const parseSkills = (value) => [...new Set(value.split(',').map((skill) => skill.trim()).filter(Boolean))];
    const teaches = parseSkills(form.teaches);
    const wants = parseSkills(form.wants);
    if (!teaches.length || !wants.length) return setError('Add at least one skill to teach and one skill to learn.');
    const person = {
      id: `user-${Date.now()}`, name: form.name.trim(), email: form.email.trim(), password: form.password,
      teaches, wants, avatar, bio: 'New to SkillSwap and excited to learn together!', rating: 5, sessions: 0, joined: new Date().getFullYear().toString(),
    };
    addSkillsToCatalog([...teaches, ...wants]);
    saveData('users', [...users, person]);
    setToast({ type: 'success', message: 'Account created successfully. Please login.' });
    navigate('/login', { replace: true });
  };
  return (
    <div className="signup-page">
      <header className="signup-top"><Link to="/" className="brand"><span className="brand-mark"><span /></span><span>skill<span className="brand-swap">swap</span></span></Link><span>Already a member? <Link to="/login">Log in</Link></span></header>
      <main className="signup-card">
        <Link to="/login" className="back-link"><ArrowLeft size={16} /> Back to login</Link>
        <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h1>Let’s make learning <span>mutual.</span></h1>
        <p className="signup-intro">Create your profile and meet students you can learn with.</p>
        <form onSubmit={submit} className="form-stack" noValidate>
          <div className="signup-avatar-row"><Avatar user={{ name: form.name, avatar }} size="xl" /><label className="upload-avatar"> <Upload size={15} /> Add a photo<input type="file" accept="image/*" onChange={uploadAvatar} /></label><span className="upload-note">Optional · JPG or PNG, max 2 MB</span></div>
          <div className="form-grid">
            <label className="field-label">Full name<input value={form.name} onChange={update('name')} placeholder="Your name" autoComplete="name" /></label>
            <label className="field-label">University email<input type="email" value={form.email} onChange={update('email')} placeholder="you@university.edu" autoComplete="email" /></label>
            <label className="field-label">Password<span className="password-field"><input type={visible ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="At least 6 characters" autoComplete="new-password" /><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible((value) => !value)}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
            <label className="field-label">Confirm password<input type="password" value={form.confirm} onChange={update('confirm')} placeholder="Type it once more" autoComplete="new-password" /></label>
            <label className="field-label field-span">Skills I can teach <small>Separate skills with commas</small><input value={form.teaches} onChange={update('teaches')} placeholder="e.g. Python, Figma, Guitar" /></label>
            <label className="field-label field-span">Skills I want to learn <small>Be curious — you can always update these later</small><input value={form.wants} onChange={update('wants')} placeholder="e.g. React, Photography, Spanish" /></label>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-primary auth-submit" type="submit">Create my account <ArrowRight size={17} /></button>
        </form>
        <p className="signup-terms">By joining, you agree to keep learning kind, curious, and collaborative.</p>
      </main>
    </div>
  );
}
