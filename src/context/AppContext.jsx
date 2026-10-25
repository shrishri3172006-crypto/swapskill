import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [toast, setToast] = useState(null);
  const value = useMemo(() => ({ user, setUser, toast, setToast }), [user, toast]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
