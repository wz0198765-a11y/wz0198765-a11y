import { useState } from 'react';
import { BookOpen, Download, Search, Filter, BookMarked, Clock, TrendingUp } from 'lucide-react';
import { Book, User } from '../types';

interface HomePageProps {
  books: Book[];
  currentUser: User;
  onReadBook: (book: Book) => void;
  onDownloadBook: (book: Book) => void;
}

export default function HomePage({ books, currentUser, onReadBook, onDownloadBook }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(books.map(b => b.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalBooks: books.length,
    totalReads: books.reduce((sum, b) => sum + b.reads, 0),
    totalDownloads: books.reduce((sum, b) => sum + b.downloads, 0),
    categories: new Set(books.map(b => b.category)).size,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900/30 to-transparent py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            مرحباً بك في <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-400 to-purple-400">المكتبة الرقمية</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من الكتب في مختلف المجالات. اقرأ أونلاين أو حمّل الكتب لقراءتها في أي وقت.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="glass-card rounded-xl p-4 text-center">
              <BookMarked className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalBooks}</div>
              <div className="text-xs text-slate-400">كتاب متاح</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalReads}</div>
              <div className="text-xs text-slate-400">مرة قراءة</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <Download className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalDownloads}</div>
              <div className="text-xs text-slate-400">تحميل</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.categories}</div>
              <div className="text-xs text-slate-400">تصنيف</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن كتاب أو مؤلف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pr-11 pl-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-slate-800">
                  {cat === 'all' ? 'جميع التصنيفات' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl text-slate-400 mb-2">لا توجد كتب متاحة</h3>
            <p className="text-slate-500">سيتم إضافة كتب جديدة قريباً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book, index) => (
              <div
                key={book.id}
                className="book-card glass-card rounded-2xl overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Book Cover */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center overflow-hidden">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-16 h-16 text-indigo-400/50" />
                  )}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-indigo-500/80 rounded-md text-xs text-white font-medium">
                    {book.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-slate-900/80 rounded-md text-xs text-slate-300 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {book.pages} صفحة
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-indigo-400 mb-2">{book.author}</p>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{book.description}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {book.reads} قراءة
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" /> {book.downloads} تحميل
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(book.uploadedAt).toLocaleDateString('ar')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onReadBook(book)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20"
                    >
                      <BookOpen className="w-4 h-4" />
                      قراءة
                    </button>
                    <button
                      onClick={() => onDownloadBook(book)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-300 text-sm font-medium rounded-lg transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
