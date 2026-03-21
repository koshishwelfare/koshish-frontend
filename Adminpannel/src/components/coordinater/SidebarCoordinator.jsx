import { FaBullhorn, FaCalendarAlt, FaExchangeAlt, FaHome, FaUsers } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const SidebarCoordinator = () => {
  const location = useLocation();

  const isActivePath = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const items = [
    { label: 'Dashboard', to: '/dashboard', icon: <FaHome /> },
    { label: 'Co-curricular Users', to: '/change-cocirculer', icon: <FaExchangeAlt /> },
    { label: 'Members & Students', to: '/user-directory', icon: <FaUsers /> },
    { label: 'Sessions', to: '/sessions', icon: <FaCalendarAlt /> },
    { label: 'Events & News', to: '/event-news', icon: <FaBullhorn /> }
  ];

  return (
    <aside className="admin-surface sticky top-[74px] h-[calc(100vh-96px)] w-full overflow-y-auto p-3 md:w-72 md:p-4">
      <p className="px-2 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Coordinator Menu</p>
      <nav className="space-y-1">
        {items.map((item) => {
          const active = isActivePath(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarCoordinator;
