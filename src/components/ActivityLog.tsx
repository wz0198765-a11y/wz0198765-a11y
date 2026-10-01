import { useState } from 'react';
import { Activity, Clock, BookOpen, Download, Search, Filter, Calendar, TrendingUp } from 'lucide-react';
import { ActivityLog as ActivityLogType, User, ReadingProgress } from '../types';

interface ActivityLogProps {
  activities: ActivityLogType[];
  users: User[];
  progress: ReadingProgress[];
  currentUser: User;
}

export default function ActivityLog({ activities, users, progress, currentUser }: ActivityLogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  const actions = ['all', ...new Set(activities.map(a => a.action))];

  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.bookTitle && a.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = filterAction === 'all' || a.action === filterAction;
    const matchesUser = selectedUser === 'all' || a.userId === selectedUser;
    return matchesSearch && matchesAction && matchesUser;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'قراءة': return <BookOpen className="w-4 h-4 text-indigo-400" />;
      case 'تحميل': return <Download className="w-4 h-4 text-green-400" />;
      case 'تسجيل دخول': return <Activity className="w-4 h-4 text-blue-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'قراءة': return 'bg-indigo-500/20 border-indigo-500/30';
      case 'تحميل': return 'bg-green-500/20 border-green-500/30';
      case 'تسجيل دخول': return 'bg-blue-500/20 border-blue-500/30';
      default: return 'bg-slate-500/20 border-slate-500/30';
    }
  };

  // Stats
  const todayActivities = activities.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.timestamp).toDateString() === today;
  });

  const totalTimeReading = progress.reduce((sum, p) => sum + p.timeSpent, 0);
  const completedBooks = progress.filter(p => p.completed).length;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} ساعة ${minutes} دقيقة`;
    return `${minutes} دقيقة`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">سجل النشاطات</h1>
        <p className="text-slate-400">تتبع جميع الأنشطة على المنصة</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{activities.length}</div>
              <div className="text-xs text-slate-400">إجمالي النشاطات</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{todayActivities.length}</div>
              <div className="text-xs text-slate-400">نشاطات اليوم</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{formatTime(totalTimeReading)}</div>
              <div className="text-xs text-slate-400">إجمالي وقت القراءة</div>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{completedBooks}</div>
              <div className="text-xs text-slate-400">كتب مكتملة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث في النشاطات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-11 pl-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="pr-11 pl-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
          >
            {actions.map(action => (
              <option key={action} value={action} className="bg-slate-800">
                {action === 'all' ? 'جميع الأنشطة' : action}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="all" className="bg-slate-800">جميع المستخدمين</option>
            {users.map(user => (
              <option key={user.id} value={user.id} className="bg-slate-800">{user.username}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">لا توجد نشاطات مسجلة</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {filteredActivities.slice(0, 100).map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors animate-slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getActionColor(activity.action)}`}>
                  {getActionIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{activity.username}</span>
                    <span className="text-sm text-slate-400">—</span>
                    <span className="text-sm text-indigo-400">{activity.action}</span>
                    {activity.bookTitle && (
                      <>
                        <span className="text-sm text-slate-400">:</span>
                        <span className="text-sm text-slate-300 truncate">{activity.bookTitle}</span>
                      </>
                    )}
                  </div>
                  {activity.duration && (
                    <div className="text-xs text-slate-500 mt-1">
                      مدة القراءة: {formatTime(activity.duration)}
                    </div>
                  )}
                  {activity.pagesRead && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      صفحات مقروءة: {activity.pagesRead}
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap">
                  {new Date(activity.timestamp).toLocaleString('ar', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reading Progress Section */}
      {progress.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">تقدم القراءة</h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-right p-4 text-sm font-medium text-slate-400">المستخدم</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">الكتاب</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">التقدم</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">الوقت</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((p, index) => {
                    const user = users.find(u => u.id === p.userId);
                    return (
                      <tr key={index} className="border-b border-slate-700/30">
                        <td className="p-4 text-sm text-white">{user?.username || 'غير معروف'}</td>
                        <td className="p-4 text-sm text-slate-300">كتاب #{p.bookId.slice(-4)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-l from-indigo-500 to-purple-500 rounded-full"
                                style={{ width: `${(p.currentPage / p.totalPages) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-400">{p.currentPage}/{p.totalPages}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-400">{formatTime(p.timeSpent)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            p.completed ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {p.completed ? 'مكتمل' : 'جاري'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
