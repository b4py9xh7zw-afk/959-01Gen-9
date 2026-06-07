import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  RefreshCw,
  CreditCard,
  UserCircle,
  Zap,
  LogOut,
  Shield,
  Settings as SettingsIcon,
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

const roleLabels = {
  admin: '管理员',
  member: '团队成员',
  author: '插件作者',
} as const;

export default function Sidebar() {
  const { currentRole, currentUser, logout } = useAppStore();
  const navigate = useNavigate();
  const items = menuItems[currentRole];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

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
        <div className="mb-3 rounded-lg border border-border bg-background px-3 py-2.5">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-text-muted">
            <Shield className="h-3.5 w-3.5" />
            当前身份
          </div>
          <div className="text-sm font-medium text-text-primary">
            {roleLabels[currentRole]}
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
            onClick={handleLogout}
            title="退出登录"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
