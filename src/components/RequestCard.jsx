import { Check, Clock3, X } from 'lucide-react';
import Avatar from './Avatar.jsx';

export default function RequestCard({ request, person, incoming, onUpdate }) {
  const statusIcon = request.status === 'accepted' ? <Check size={14} /> : request.status === 'rejected' ? <X size={14} /> : <Clock3 size={14} />;
  return (
    <article className="request-card">
      <Avatar user={person} size="md" />
      <div className="request-content">
        <div className="request-title"><strong>{person?.name || 'Student'}</strong><span className={`status-pill status-${request.status}`}>{statusIcon}{request.status}</span></div>
        <p className="request-skill">Wants to learn <strong>{request.skill}</strong>{request.offering && <> · offers <strong>{request.offering}</strong></>}</p>
        {request.message && <p className="request-message">“{request.message}”</p>}
        <span className="request-date">{new Date(request.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
      </div>
      {incoming && request.status === 'pending' && <div className="request-actions"><button className="button button-success button-small" onClick={() => onUpdate(request.id, 'accepted')}><Check size={15} /> Accept</button><button className="button button-light button-small" onClick={() => onUpdate(request.id, 'rejected')}><X size={15} /> Decline</button></div>}
    </article>
  );
}
