import { useState } from 'react';
import {
  Folder, FolderOpen, FileText, FileCode, FileJson,
  ChevronLeft, ChevronDown, BookOpen, Palette, Database,
  Settings, Layout, Users, Activity, LogIn, Home, Library,
  Monitor, Type, Package, Cpu, File, Hash
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  description?: string;
  descriptionAr?: string;
  children?: FileNode[];
  icon?: React.ElementType;
  color?: string;
  lines?: number;
}

const projectTree: FileNode = {
  name: 'digital-library',
  type: 'folder',
  description: 'مشروع المكتبة الرقمية',
  descriptionAr: 'المشروع الرئيسي',
  children: [
    {
      name: 'public',
      type: 'folder',
      description: 'Public assets folder',
      descriptionAr: 'ملفات عامة',
      children: []
    },
    {
      name: 'src',
      type: 'folder',
      description: 'Source code directory',
      descriptionAr: 'مجلد الكود المصدري',
      children: [
        {
          name: 'components',
          type: 'folder',
          description: 'React components',
          descriptionAr: 'مكونات الواجهة',
          children: [
            {
              name: 'Login.tsx',
              type: 'file',
              description: 'Login page with authentication',
              descriptionAr: 'صفحة تسجيل الدخول والمصادقة',
              icon: LogIn,
              color: 'text-blue-400',
              lines: 105
            },
            {
              name: 'Navbar.tsx',
              type: 'file',
              description: 'Navigation bar component',
              descriptionAr: 'شريط التنقل الرئيسي',
              icon: Layout,
              color: 'text-green-400',
              lines: 68
            },
            {
              name: 'HomePage.tsx',
              type: 'file',
              description: 'Main page with books grid',
              descriptionAr: 'الصفحة الرئيسية مع عرض الكتب',
              icon: Home,
              color: 'text-purple-400',
              lines: 168
            },
            {
              name: 'BookReader.tsx',
              type: 'file',
              description: 'Book reading modal with progress',
              descriptionAr: 'قارئ الكتب مع تتبع التقدم',
              icon: BookOpen,
              color: 'text-amber-400',
              lines: 132
            },
            {
              name: 'UserManagement.tsx',
              type: 'file',
              description: 'Admin user management panel',
              descriptionAr: 'لوحة إدارة المستخدمين (للأدمن)',
              icon: Users,
              color: 'text-rose-400',
              lines: 312
            },
            {
              name: 'BookManagement.tsx',
              type: 'file',
              description: 'Admin book management panel',
              descriptionAr: 'لوحة إدارة الكتب (للأدمن)',
              icon: Library,
              color: 'text-cyan-400',
              lines: 310
            },
            {
              name: 'ActivityLog.tsx',
              type: 'file',
              description: 'Activity tracking & statistics',
              descriptionAr: 'سجل النشاطات والإحصائيات',
              icon: Activity,
              color: 'text-emerald-400',
              lines: 260
            },
            {
              name: 'Settings.tsx',
              type: 'file',
              description: 'User settings & profile',
              descriptionAr: 'إعدادات المستخدم والحساب',
              icon: Settings,
              color: 'text-orange-400',
              lines: 195
            },
          ]
        },
        {
          name: 'App.tsx',
          type: 'file',
          description: 'Main application component & routing',
          descriptionAr: 'المكون الرئيسي وإدارة التنقل',
          icon: Monitor,
          color: 'text-indigo-400',
          lines: 280
        },
        {
          name: 'main.tsx',
          type: 'file',
          description: 'Application entry point',
          descriptionAr: 'نقطة دخول التطبيق',
          icon: Cpu,
          color: 'text-red-400',
          lines: 12
        },
        {
          name: 'index.css',
          type: 'file',
          description: 'Global styles & animations',
          descriptionAr: 'الأنماط العامة والرسوم المتحركة',
          icon: Palette,
          color: 'text-pink-400',
          lines: 88
        },
        {
          name: 'store.ts',
          type: 'file',
          description: 'Data management & localStorage',
          descriptionAr: 'إدارة البيانات والتخزين المحلي',
          icon: Database,
          color: 'text-teal-400',
          lines: 145
        },
        {
          name: 'types.ts',
          type: 'file',
          description: 'TypeScript interfaces & types',
          descriptionAr: 'أنواع TypeScript والواجهات',
          icon: Type,
          color: 'text-violet-400',
          lines: 38
        },
      ]
    },
    {
      name: 'index.html',
      type: 'file',
      description: 'HTML entry point (RTL Arabic)',
      descriptionAr: 'صفحة HTML الرئيسية (عربي RTL)',
      icon: FileCode,
      color: 'text-orange-400',
      lines: 98
    },
    {
      name: 'package.json',
      type: 'file',
      description: 'Project dependencies & scripts',
      descriptionAr: 'إعدادات المشروع والمكتبات',
      icon: Package,
      color: 'text-green-400',
      lines: 30
    },
    {
      name: 'package-lock.json',
      type: 'file',
      description: 'Locked dependency versions',
      descriptionAr: 'إصدارات المكتبات المقفلة',
      icon: FileJson,
      color: 'text-yellow-400',
      lines: 5000
    },
    {
      name: 'tsconfig.json',
      type: 'file',
      description: 'TypeScript configuration',
      descriptionAr: 'إعدادات TypeScript',
      icon: FileCode,
      color: 'text-blue-400',
      lines: 25
    },
    {
      name: 'vite.config.js',
      type: 'file',
      description: 'Vite build configuration',
      descriptionAr: 'إعدادات بناء Vite',
      icon: FileCode,
      color: 'text-purple-400',
      lines: 15
    },
  ]
};

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth < 2);

  const getIcon = () => {
    if (node.type === 'folder') {
      return isOpen ? (
        <FolderOpen className="w-5 h-5 text-amber-400" />
      ) : (
        <Folder className="w-5 h-5 text-amber-400" />
      );
    }
    const IconComponent = node.icon || FileText;
    return <IconComponent className={`w-5 h-5 ${node.color || 'text-slate-400'}`} />;
  };

  if (node.type === 'folder') {
    return (
      <div>
        <div
          className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-700/30 cursor-pointer transition-all group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </span>
          {getIcon()}
          <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
            {node.name}/
          </span>
          <span className="text-xs text-slate-500 mr-auto hidden sm:inline">
            {node.descriptionAr}
          </span>
        </div>
        {isOpen && node.children && (
          <div className="mr-6 border-r border-slate-700/30 pr-2">
            {node.children.map((child, index) => (
              <FileTreeNode key={index} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-700/30 transition-all group">
      <span className="w-4"></span>
      {getIcon()}
      <span className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
        {node.name}
      </span>
      {node.lines && node.lines < 1000 && (
        <span className="text-xs text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded">
          {node.lines} سطر
        </span>
      )}
      <span className="text-xs text-slate-500 mr-auto hidden sm:inline">
        {node.descriptionAr}
      </span>
    </div>
  );
}

export default function FileTree() {
  const totalFiles = countFiles(projectTree);
  const totalFolders = countFolders(projectTree);

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/30">
            <Folder className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            مخطط مسار الملفات
          </h1>
          <p className="text-slate-400 text-lg">
            الهيكل الكامل لمشروع المكتبة الرقمية
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-400">{totalFiles}</div>
            <div className="text-xs text-slate-400">ملف</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{totalFolders}</div>
            <div className="text-xs text-slate-400">مجلد</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">8</div>
            <div className="text-xs text-slate-400">مكونات React</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">3</div>
            <div className="text-xs text-slate-400">ملفات أساسية</div>
          </div>
        </div>

        {/* File Tree */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-slate-400 font-mono">digital-library/</span>
          </div>
          <FileTreeNode node={projectTree} />
        </div>

        {/* Legend */}
        <div className="glass-card rounded-2xl p-6 mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-lg font-bold text-white mb-4">دليل الألوان</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm text-slate-400">TSX - مكونات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-400"></div>
              <span className="text-sm text-slate-400">TS - بيانات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-400"></div>
              <span className="text-sm text-slate-400">CSS - أنماط</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span className="text-sm text-slate-400">مجلدات</span>
            </div>
          </div>
        </div>

        {/* Architecture Info */}
        <div className="glass-card rounded-2xl p-6 mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-lg font-bold text-white mb-4">بنية المشروع</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
              <Monitor className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-white">App.tsx</span>
                <span className="text-slate-400"> — المكون الرئيسي، إدارة الحالة والتنقل بين الصفحات</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
              <Database className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-white">store.ts</span>
                <span className="text-slate-400"> — طبقة البيانات، التعامل مع localStorage</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
              <Type className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-white">types.ts</span>
                <span className="text-slate-400"> — تعريفات TypeScript (User, Book, Activity, Progress)</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
              <Layout className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-white">components/</span>
                <span className="text-slate-400"> — 8 مكونات واجهة (Login, Navbar, Home, Reader, Users, Books, Activity, Settings)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function countFiles(node: FileNode): number {
  if (node.type === 'file') return 1;
  return (node.children || []).reduce((sum, child) => sum + countFiles(child), 0);
}

function countFolders(node: FileNode): number {
  if (node.type === 'folder') {
    return 1 + (node.children || []).reduce((sum, child) => sum + countFolders(child), 0);
  }
  return 0;
}
