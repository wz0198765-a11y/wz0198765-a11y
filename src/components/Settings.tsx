import { useState } from 'react';
import { User, Lock, Save, CheckCircle, Shield, Trash2 } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsProps {
  currentUser: UserType;
  onUpdateUser: (userId: string, updates: Partial<UserType>) => void;
}

export default function Settings({ currentUser, onUpdateUser }: SettingsProps) {
  const [username, setUsername] = useState(currentUser.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdateUsername = () => {
    if (!username.trim()) {
      setErrorMessage('اسم المستخدم لا يمكن أن يكون فارغاً');
      return;
    }
    onUpdateUser(currentUser.id, { username: username.trim() });
    setSuccessMessage('تم تحديث اسم المستخدم بنجاح');
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUpdatePassword = () => {
    if (currentPassword !== currentUser.password) {
      setErrorMessage('كلمة المرور الحالية غير صحيحة');
      return;
    }
    if (!newPassword.trim()) {
      setErrorMessage('كلمة المرور الجديدة لا يمكن أن تكون فارغة');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('كلمة المرور الجديدة وتأكيدها غير متطابقتين');
      return;
    }
    onUpdateUser(currentUser.id, { password: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccessMessage('تم تحديث كلمة المرور بنجاح');
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">الإعدادات</h1>
        <p className="text-slate-400">إدارة حسابك ومعلوماتك الشخصية</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 mb-6 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 animate-fade-in">
          <Lock className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Section */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            currentUser.role === 'admin' ? 'bg-amber-500/20' : 'bg-indigo-500/20'
          }`}>
            {currentUser.role === 'admin' ? (
              <Shield className="w-8 h-8 text-amber-400" />
            ) : (
              <User className="w-8 h-8 text-indigo-400" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{currentUser.username}</h2>
            <p className="text-sm text-slate-400">
              {currentUser.role === 'admin' ? 'مدير النظام' : 'مستخدم'} • 
              انضم في {new Date(currentUser.createdAt).toLocaleDateString('ar')}
            </p>
          </div>
        </div>

        {/* Update Username */}
        <div className="border-t border-slate-700/50 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            تحديث اسم المستخدم
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-all"
              placeholder="اسم المستخدم الجديد"
            />
            <button
              onClick={handleUpdateUsername}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              حفظ
            </button>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-400" />
          تغيير كلمة المرور
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">كلمة المرور الحالية</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-all"
              placeholder="أدخل كلمة المرور الحالية"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-all"
              placeholder="أدخل كلمة المرور الجديدة"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-all"
              placeholder="أعد إدخال كلمة المرور الجديدة"
            />
          </div>
          <button
            onClick={handleUpdatePassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
          >
            <Lock className="w-4 h-4" />
            تغيير كلمة المرور
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          معلومات الحساب
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
            <span className="text-slate-400">معرف المستخدم</span>
            <span className="text-white font-mono text-sm">{currentUser.id}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
            <span className="text-slate-400">الدور</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentUser.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'
            }`}>
              {currentUser.role === 'admin' ? 'مدير' : 'مستخدم'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
            <span className="text-slate-400">الحالة</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
              نشط
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-400">تاريخ الإنشاء</span>
            <span className="text-white text-sm">
              {new Date(currentUser.createdAt).toLocaleString('ar')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
