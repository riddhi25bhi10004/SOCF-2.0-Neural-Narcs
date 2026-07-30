import { NavLink } from 'react-router-dom';
import { Activity, Clock, Droplets, Grid3x3, Cpu, Gauge, FileText, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/scheduler', label: 'Scheduler', icon: Clock },
  { path: '/water', label: 'Water', icon: Droplets },
  { path: '/grid', label: 'Grid', icon: Grid3x3 },
  { path: '/hardware', label: 'Hardware', icon: Cpu },
  { path: '/ecoscore', label: 'EcoScore', icon: Gauge },
  { path: '/reports', label: 'Reports', icon: FileText },
];

interface NavbarProps {
  isSidebar?: boolean;
}

function Navbar({ isSidebar = false }: NavbarProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav
      className={
        isSidebar
          ? 'glass-strong sticky top-6 z-20 hidden h-[calc(100vh-3rem)] w-72 min-w-[18rem] flex-col justify-between gap-8 px-6 py-6 lg:flex'
          : 'glass-strong sticky top-0 z-50 px-4 py-3 flex items-center justify-between'
      }
    >
      <div className={isSidebar ? 'space-y-6' : 'flex items-center justify-between w-full'}>
        <NavLink to="/" className={isSidebar ? 'flex items-center gap-3' : 'flex items-center gap-2'}>
          <div className={isSidebar ? 'w-10 h-10 rounded-3xl bg-eco-primary/15 flex items-center justify-center shadow-sm shadow-eco-primary/20' : 'w-8 h-8 rounded-lg bg-eco-primary/20 flex items-center justify-center'}>
            <Activity className="w-5 h-5 text-eco-primary" />
          </div>
          <div className={isSidebar ? 'space-y-1' : 'flex items-center gap-2'}>
            <span className={isSidebar ? 'text-xl font-semibold text-eco-dark' : 'text-lg font-semibold text-eco-dark hidden sm:block'}>
              PRITHVI
            </span>
            {isSidebar && (
              <>
                <div className="text-xs uppercase tracking-[0.3em] text-eco-muted">Navigation</div>
                <div className="h-0.5 w-14 rounded-full bg-eco-primary/20" />
              </>
            )}
          </div>
        </NavLink>
      </div>

      <div className={isSidebar ? 'flex flex-col gap-2 overflow-y-auto pr-1' : 'flex items-center gap-1 overflow-x-auto scrollbar-hide'}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isSidebar
                ? `group flex items-center gap-3 rounded-3xl px-4 py-3 transition duration-200 ${
                    isActive
                      ? 'bg-eco-primary/10 text-eco-primary shadow-[0_16px_40px_rgba(201,122,29,0.1)]'
                      : 'text-eco-muted hover:text-eco-dark hover:bg-eco-border/40'
                  }`
                : `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-eco-primary/10 text-eco-primary'
                      : 'text-eco-muted hover:text-eco-dark hover:bg-eco-border/30'
                  }`
            }
          >
            <item.icon className={isSidebar ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
            <span className={isSidebar ? 'text-sm font-medium' : 'hidden md:inline'}>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className={isSidebar ? 'space-y-4' : 'flex items-center gap-3'}>
        <div className={isSidebar ? 'rounded-3xl border border-eco-border/70 bg-eco-border/20 p-4' : 'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-eco-border/20'}>
          <User className={isSidebar ? 'w-4 h-4 text-eco-muted' : 'w-3.5 h-3.5 text-eco-muted'} />
          <span className={isSidebar ? 'text-sm font-medium text-eco-dark' : 'text-xs font-medium text-eco-dark hidden sm:block'}>
            {user?.name || 'User'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className={isSidebar ? 'flex w-full items-center justify-center gap-2 rounded-3xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-500/15' : 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors duration-200'}
        >
          <LogOut className={isSidebar ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          <span>{isSidebar ? 'Sign out' : 'Logout'}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;