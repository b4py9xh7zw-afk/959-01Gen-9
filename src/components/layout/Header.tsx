import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';

export default function Header() {
  const { currentUser } = useAppStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = 3;

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 ml-64">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="搜索插件、功能..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-surface-light text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-xs font-medium rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-surface-light transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text-primary">
                {currentUser.name}
              </p>
              <p className="text-xs text-text-muted capitalize">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-text-muted transition-transform",
              isDropdownOpen && "rotate-180"
            )} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-xl shadow-card overflow-hidden animate-slide-in z-50">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-text-primary">
                      {currentUser.name}
                    </p>
                    <p className="text-sm text-text-muted">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-light hover:text-text-primary transition-colors">
                  <User className="w-4 h-4" />
                  个人资料
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-light hover:text-text-primary transition-colors">
                  <Settings className="w-4 h-4" />
                  设置
                </button>
              </div>

              <div className="p-2 border-t border-border">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/10 transition-colors">
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
