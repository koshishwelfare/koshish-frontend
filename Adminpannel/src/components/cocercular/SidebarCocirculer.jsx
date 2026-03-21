import { FaBullhorn, FaCalendarAlt, FaChartLine, FaHome, FaImages, FaUserGraduate } from 'react-icons/fa';
import { HiChevronDown } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';

const SidebarCocirculer = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState({
    members: true,
    events: false,
    landingPage: true,
    academic: true
  });

  const menu = useMemo(
    () => [
      { label: 'Dashboard', to: '/', icon: <FaHome /> },
      {
        key: 'members',
        label: 'Members',
        icon: <FaUserGraduate />,
        children: [
          { label: 'Members', to: '/member/all' }
        ]
      },
      {
        key: 'events',
        label: 'Events',
        icon: <FaCalendarAlt />,
        children: [
          { label: 'Events', to: '/event/all' }
        ]
      },
      {
        key: 'landingPage',
        label: 'Landing Page',
        icon: <FaChartLine />,
        children: [
          { label: 'Headers', to: '/landpage/header/all' },
          { label: 'Testimonials', to: '/landpage/testimorals/all' },
          { label: 'Achievements', to: '/landpage/achievement/all' }
        ]
      },
      { label: 'News', to: '/news', icon: <FaBullhorn /> },
      { label: 'Gallery', to: '/gallery', icon: <FaImages /> },
      {
        key: 'academic',
        label: 'Academic',
        icon: <FaChartLine />,
        children: [
          { label: 'Session Listing', to: '/academic/sessions' },
          { label: 'Class Listing', to: '/academic/classes' },
          { label: 'Teacher Self Attendance', to: '/academic/teacher-attendance' }
        ]
      },
      {
        key: 'profile',
        label: 'Profile Management',
        icon: <FaUserGraduate />,
        children: [
          { label: 'Profile', to: '/profile-management' }
        ]
      },
      { label: 'Contact', to: '/contact', icon: <FaBullhorn /> }
    ],
    []
  );

  const toggle = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isActivePath = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside className="admin-surface sticky top-[74px] h-[calc(100vh-96px)] w-full overflow-y-auto p-3 md:w-72 md:p-4">
      <p className="px-2 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Co-curricular Menu</p>
      <nav className="space-y-1">
        {menu.map((item) => {
          if (!item.children) {
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
          }

          const isExpanded = expanded[item.key];
          return (
            <div key={item.key} className="rounded-lg border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => toggle(item.key)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                <HiChevronDown className={`text-base transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="space-y-1 border-t border-slate-100 px-2 py-2">
                  {item.children.map((child) => {
                    const active = isActivePath(child.to);
                    return (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={`block rounded-md px-2.5 py-1.5 text-sm transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  )
}

export default SidebarCocirculer