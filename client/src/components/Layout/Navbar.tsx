import { NavLink } from 'react-router-dom';
import { Activity, Brain, Clock, Droplets, Grid3x3, Cpu, Gauge, FileText, LogOut, User } from 'lucide-react'; // ← ADD LogOut, User
import { useAuth } from '../../context/AuthContext'; // ← ADD THIS

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Activity },
  { path: '/advisor', label: 'AI Advisor', icon: Brain },
  { path: '/scheduler', label: 'Scheduler', icon: Clock },
  { path: '/water', label: 'Water', icon: Droplets },
  { path: '/grid', label: 'Grid', icon: Grid3x3 },
  { path: '/hardware', label: 'Hardware', icon: Cpu },
  { path: '/ecoscore', label: 'EcoScore', icon: Gauge },
  { path: '/reports', label: 'Reports', icon: FileText },
];

function Navbar() {
  const { user, logout } = useAuth(); // ← ADD THIS

  const handleLogout = async () => { // ← ADD THIS
    await logout();
  };

  return (
    <nav className="glass-strong sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      <NavLink to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-eco-primary/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-eco-primary" />
        </div>
        <span className="text-lg font-semibold text-eco-dark hidden sm:block">EcoPulse</span>
      </NavLink>
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-eco-primary/10 text-eco-primary'
                  : 'text-eco-muted hover:text-eco-dark hover:bg-eco-border/30'
              }`
            }
          >
            <item.icon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{item.label}</span>
          </NavLink>
        ))}
      </div>
      {/* ← ADD THIS USER MENU SECTION */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-eco-border/20">
          <User className="w-3.5 h-3.5 text-eco-muted" />
          <span className="text-xs font-medium text-eco-dark hidden sm:block">
            {user?.name || 'User'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;