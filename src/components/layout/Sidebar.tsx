import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  RefreshCw,
  CreditCard,
  UserCircle,
  Zap,
  ChevronDown,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';

const menuItems = {
  admin: [
    { path: '/', label: '仪表板', icon: LayoutDashboard },
    { path: '/marketplace', label: '插件市场', icon: Package },
    { path: '/seats', label: '席位管理', icon: Users },
    { path: '/updates', label: '版本更新', icon: RefreshCw },
    { path: '/payments', label: '付款管理', icon: CreditCard },
    { path: '/profile', label: '个人设置', icon: SettingsIcon },
  ],
  member: [
    { path: '/', label: '仪表板', icon: LayoutDashboard },
    { path: '/marketplace', label: '插件市场', icon: Package },
    { path: '/seats', label: '我的席位', icon: Users },
    { path: '/updates', label: '版本更新', icon: RefreshCw },
    { path: '/profile', label: '个人设置', icon: SettingsIcon },
  ],
  author: [
    { path: '/', label: '作者中心', icon: UserCircle },
    { path: '/marketplace', label: '插件市场', icon: Package },
    { path: '/updates', label: '版本管理', icon: RefreshCw },
    { path: '/profile', label: '个人设置', icon: SettingsIcon },
  ],
};

const roleOptions = [
  { value: 'admin', label: '管理员' },
  { value: 'member', label: '团队成员' },
  { value: 'author', label: '插件作者' },
];

export default function Sidebar() {
  const { currentRole, setCurrentRole, currentUser, setCurrentRole: setRole } = useAppStore();
  const navigate = useNavigate();
  const items = menuItems[currentRole];

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary">PluginHub</h1>
            <p className="text-xs text-text-muted">插件管理平台</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <label className="text-xs font-medium text-text-muted mb-2 block">
            角色切换
          </label>
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as 'admin' | 'member' | 'author')}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-text-muted truncate">
              {currentUser.email}
            </p>
          </div>
          <button 
            className="p-1.5 rounded-lg hover:bg-surface-light text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => {
              setRole('admin');
              navigate('/login');
            }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
