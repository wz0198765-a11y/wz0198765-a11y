import { BookOpen, Home, Settings, LogOut, Users, Activity, Library, Shield } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Navbar({ currentUser, currentPage, onNavigate, onLogout }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    ...(currentUser.role === 'admin' ? [
      { id: 'users', label: 'المستخدمين', icon: Users },
      { id: 'books-admin', label: 'إدارة الكتب', icon: Library },
      { id: 'activities', label: 'سجل النشاطات', icon: Activity },
    ] : []),
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">المكتبة الرقمية</span>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
              {currentUser.role === 'admin' ? (
                <Shield className="w-4 h-4 text-amber-400" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                  {currentUser.username[0].toUpperCase()}
                </div>
              )}
              <span className="text-sm text-slate-300 hidden sm:inline">{currentUser.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
