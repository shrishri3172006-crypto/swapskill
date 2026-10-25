import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import Toast from './Toast.jsx';

export default function Layout() {
  return <><Navbar /><div className="app-frame"><Sidebar /><main className="main-content"><Outlet /></main></div><Toast /></>;
}
