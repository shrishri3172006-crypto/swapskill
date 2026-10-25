import { useMemo, useState } from 'react';
import { Inbox, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import RequestCard from '../components/RequestCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { getData, updateData } from '../utils/storage.js';

export default function Requests() {
  const { user, setToast } = useApp();
  const [refresh, setRefresh] = useState(0);
  const users = getData('users', []);
  const allRequests = useMemo(() => getData('requests', []), [refresh]);
  const incoming = allRequests.filter((request) => request.to === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const sent = allRequests.filter((request) => request.from === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const updateStatus = (id, status) => {
    updateData('requests', (items) => items.map((request) => request.id === id ? { ...request, status } : request));
    setRefresh((value) => value + 1);
    setToast({ type: 'success', message: status === 'accepted' ? 'Request accepted. Time to plan your skill swap!' : 'Request declined.' });
  };
  const render = (request, isIncoming) => <RequestCard key={request.id} request={request} person={users.find((person) => person.id === (isIncoming ? request.from : request.to))} incoming={isIncoming} onUpdate={updateStatus} />;
  return <div className="page-wrap">
    <PageHeader eyebrow="LET THE LEARNING BEGIN" title="Requests" description="Every great skill swap starts with a hello." />
    <div className="request-columns">
      <section className="request-section"><div className="request-section-heading"><span className="request-section-icon incoming-icon"><Inbox size={19} /></span><div><h2>Incoming</h2><p>Students who’d like to learn from you</p></div><span className="section-count">{incoming.filter((request) => request.status === 'pending').length}</span></div>
        {incoming.length ? <div className="request-list request-list-full">{incoming.map((request) => render(request, true))}</div> : <div className="empty-state request-empty"><Inbox size={25} /><h3>It’s quiet for now</h3><p>When someone asks to learn from you, their request will appear here.</p></div>}
      </section>
      <section className="request-section"><div className="request-section-heading"><span className="request-section-icon sent-icon"><Send size={18} /></span><div><h2>Sent</h2><p>People you’ve reached out to</p></div><span className="section-count">{sent.length}</span></div>
        {sent.length ? <div className="request-list request-list-full">{sent.map((request) => render(request, false))}</div> : <div className="empty-state request-empty"><Send size={25} /><h3>Your first hello is waiting</h3><p>Explore skills and reach out to someone who can teach you.</p></div>}
      </section>
    </div>
  </div>;
}
