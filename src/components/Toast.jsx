import { useEffect } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Toast() {
  const { toast, setToast } = useApp();
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast, setToast]);
  if (!toast) return null;
  const Icon = toast.type === 'error' ? XCircle : toast.type === 'success' ? CheckCircle2 : Info;
  return (
    <div className={`toast toast-${toast.type || 'info'}`} role="status">
      <Icon size={19} />
      <span>{toast.message}</span>
      <button className="toast-close" aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={16} /></button>
    </div>
  );
}
