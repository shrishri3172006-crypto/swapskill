import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getData, saveData } from '../utils/storage.js';

export default function RequestDialog({ person, onClose }) {
  const { user, setToast } = useApp();
  const navigate = useNavigate();
  const possibleSkills = useMemo(() => (person.teaches || []).filter((skill) => (user.wants || []).some((wanted) => wanted.toLowerCase() === skill.toLowerCase())), [person, user]);
  const [skill, setSkill] = useState(possibleSkills[0] || person.teaches?.[0] || '');
  const possibleOffers = (person.wants || []).filter((wanted) => (user.teaches || []).some((offered) => offered.toLowerCase() === wanted.toLowerCase()));
  const [offering, setOffering] = useState(possibleOffers[0] || user.teaches?.[0] || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (!skill) return setError('Choose a skill you’d like to learn.');
    const requests = getData('requests', []);
    const duplicate = requests.some((request) => request.from === user.id && request.to === person.id && request.skill === skill && request.status !== 'rejected');
    if (duplicate) return setError('You already have an active request for this skill.');
    saveData('requests', [{
      id: `request-${Date.now()}`,
      from: user.id,
      to: person.id,
      skill,
      offering,
      message: message.trim() || `Hi ${person.name.split(' ')[0]}, I'd love to learn ${skill} with you!`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }, ...requests]);
    onClose();
    setToast({ type: 'success', message: `Request sent to ${person.name.split(' ')[0]}!` });
    navigate('/requests');
  };
  return createPortal(<div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-dialog-title">
      <button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X size={19} /></button>
      <span className="eyebrow">START A SKILL SWAP</span>
      <h2 id="request-dialog-title">Say hello to {person.name.split(' ')[0]}.</h2>
      <p>Tell them what you’d love to learn and what you can share in return.</p>
      <form className="form-stack" onSubmit={submit}>
        <label className="field-label">I’d like to learn<select value={skill} onChange={(event) => setSkill(event.target.value)}>{(person.teaches || []).map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="field-label">I can share in return<select value={offering} onChange={(event) => setOffering(event.target.value)}>{(user.teaches || []).length ? user.teaches.map((item) => <option key={item} value={item}>{item}</option>) : <option value="">Let’s just connect</option>}</select></label>
        <label className="field-label">Add a note <small>Optional</small><textarea rows="3" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="A friendly hello goes a long way..." /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="button button-primary auth-submit" type="submit">Send request</button>
      </form>
    </section>
  </div>, document.body);
}
