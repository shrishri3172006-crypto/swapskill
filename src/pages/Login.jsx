import { useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getData, setCurrentUser } from '../utils/storage.js';
import Toast from '../components/Toast.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password) return setError('Enter your email and password to continue.');
    const found = getData('users', []).find((person) => person.email.toLowerCase() === email.trim().toLowerCase() || person.name.toLowerCase() === email.trim().toLowerCase());
    if (!found || found.password !== password) return setError('That email or password doesn’t look right. Please try again.');
    setCurrentUser(found);
    setUser(found);
    setToast({ type: 'success', message: `Welcome back, ${found.name.split(' ')[0]}!` });
    navigate(location.state?.from || '/dashboard', { replace: true });
  };
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-orb orb-one" /><div className="auth-visual-orb orb-two" />
        <Link to="/" className="brand brand-light"><span className="brand-mark"><span /></span><span>skill<span className="brand-swap">swap</span></span></Link>
        <div className="auth-visual-copy"><span className="auth-pill">A better way to learn</span><h1>What if your next skill was just <em>one conversation</em> away?</h1><p>Share what you know. Learn what you love. Find your people along the way.</p></div>
        <div className="auth-quote"><div className="quote-avatars"><span>A</span><span>P</span><span>M</span><span>+</span></div><div><strong>Learning is better together</strong><small>Join a community of curious students</small></div></div>
        <div className="auth-visual-footer">MADE FOR CURIOUS MINDS <span>✳</span></div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><Link to="/" className="brand"><span className="brand-mark"><span /></span><span>skill<span className="brand-swap">swap</span></span></Link></div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Pick up where<br />you left off.</h2>
          <p className="auth-subtitle">Log in to your SkillSwap account and keep growing.</p>
          <form onSubmit={submit} className="form-stack" noValidate>
            <label className="field-label">Email or username<input type="text" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@university.edu" autoComplete="username" /></label>
            <label className="field-label">Password<span className="password-field"><input type={visible ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" /><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible((value) => !value)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
            {error && <p className="form-error">{error}</p>}
            <button className="button button-primary auth-submit" type="submit">Log in <ArrowRight size={17} /></button>
          </form>
          <p className="auth-switch">New to SkillSwap? <Link to="/signup">Create Account</Link></p>
        </div>
      </div>
      <Toast />
    </div>
  );
}
