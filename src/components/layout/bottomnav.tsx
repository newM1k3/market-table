import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Map, ScanLine, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/recipes', icon: BookOpen, label: 'Recipes' },
  { to: '/map', icon: Map, label: 'Map' },
  { to: '/scan', icon: ScanLine, label: 'Scan' },
  { to: '/account', icon: User, label: 'Account' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 bottom-nav-height safe-bottom">
      <div className="h-full max-w-lg mx-auto flex items-center justify-around px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-colors min-w-[64px] ${
                active
                  ? 'text-market-700'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[11px] font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
