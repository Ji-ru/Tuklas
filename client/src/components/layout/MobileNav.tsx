import { Link, useLocation } from 'react-router-dom';

export default function MobileNav() {
  const { pathname } = useLocation();

  const tabs = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/explore', label: 'Explore', icon: 'travel_explore' },
    { path: '/plan', label: 'Plan', icon: 'edit_calendar' },
    { path: '/chat', label: 'AI Chat', icon: 'chat_bubble' },
    { path: '/sample-trip', label: 'Trips', icon: 'map' },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 pt-2 bg-surface shadow-[0_-8px_24px_rgba(0,51,102,0.1)] rounded-t-xl z-50"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className="flex-1 flex flex-col items-center justify-center text-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <div className={`flex flex-col items-center justify-center px-3 py-1 rounded-full transition-all duration-150 ${
              active
                ? 'bg-secondary-container text-on-secondary-container scale-95 shadow-sm gap-0.5'
                : 'gap-0.5'
            }`}>
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm text-label-sm">{tab.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
