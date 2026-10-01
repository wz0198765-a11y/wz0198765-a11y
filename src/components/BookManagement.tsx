import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, BookOpen, Upload, AlertTriangle } from 'lucide-react';
import { Book, User } from '../types';

interface BookManagementProps {
  books: Book[];
  currentUser: User;
  onAddBook: (book: Omit<Book, 'id' | 'uploadedAt' | 'downloads' | 'reads'>) => void;
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void;
  onDeleteBook: (bookId: string) => void;
}

export default function BookManagement({ books, currentUser, onAddBook, onUpdateBook, onDeleteBook }: BookManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    coverUrl: '',
    pages: 1,
    content: '',
  });

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBook = () => {
    if (!newBook.title.trim() || !newBook.author.trim()) return;
    onAddBook({
      ...newBook,
      uploadedBy: currentUser.username,
    });
    setNewBook({ title: '', author: '', description: '', category: '', coverUrl: '', pages: 1, content: '' });
    setShowAddModal(false);
  };

  const handleUpdateBook = () => {
    if (!editingBook) return;
    onUpdateBook(editingBook.id, editingBook);
    setEditingBook(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">إدارة الكتب</h1>
          <p className="text-slate-400">إجمالي الكتب: {books.length}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" />
          إضافة كتاب
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="ابحث عن كتاب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-11 pl-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <div key={book.id} className="glass-card rounded-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center relative">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-12 h-12 text-indigo-400/50" />
              )}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 rounded text-xs text-slate-300">
                {book.pages} صفحة
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white mb-1 line-clamp-1">{book.title}</h3>
              <p className="text-sm text-indigo-400 mb-2">{book.author}</p>
              <p className="text-xs text-slate-500 mb-3">التصنيف: {book.category || 'غير محدد'}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <span>{book.reads} قراءة</span>
                <span>•</span>
                <span>{book.downloads} تحميل</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingBook({ ...book })}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg transition-colors text-sm"
                >
                  <Edit2 className="w-3 h-3" />
                  تعديل
                </button>
                <button
                  onClick={() => setDeleteConfirm(book.id)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" />
              إضافة كتاب جديد
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">عنوان الكتاب *</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="أدخل عنوان الكتاب"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">المؤلف *</label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="أدخل اسم المؤلف"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">الوصف</label>
                <textarea
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none h-20"
                  placeholder="أدخل وصف الكتاب"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">التصنيف</label>
                  <input
                    type="text"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    placeholder="مثال: أدب، علوم..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">عدد الصفحات</label>
                  <input
                    type="number"
                    min={1}
                    value={newBook.pages}
                    onChange={(e) => setNewBook({ ...newBook, pages: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">رابط صورة الغلاف</label>
                <input
                  type="url"
                  value={newBook.coverUrl}
                  onChange={(e) => setNewBook({ ...newBook, coverUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">محتوى الكتاب</label>
                <textarea
                  value={newBook.content}
                  onChange={(e) => setNewBook({ ...newBook, content: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none h-32"
                  placeholder="أدخل محتوى الكتاب (يمكنك استخدام ---PAGE--- للفصل بين الصفحات)"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddBook}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
              >
                إضافة الكتاب
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">تعديل الكتاب</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">عنوان الكتاب</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">المؤلف</label>
                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">الوصف</label>
                <textarea
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">التصنيف</label>
                  <input
                    type="text"
                    value={editingBook.category}
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">عدد الصفحات</label>
                  <input
                    type="number"
                    min={1}
                    value={editingBook.pages}
                    onChange={(e) => setEditingBook({ ...editingBook, pages: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">رابط صورة الغلاف</label>
                <input
                  type="url"
                  value={editingBook.coverUrl}
                  onChange={(e) => setEditingBook({ ...editingBook, coverUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">محتوى الكتاب</label>
                <textarea
                  value={editingBook.content}
                  onChange={(e) => setEditingBook({ ...editingBook, content: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none h-32"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateBook}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
              >
                حفظ التعديلات
              </button>
              <button
                onClick={() => setEditingBook(null)}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm animate-fade-in text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">تأكيد الحذف</h3>
            <p className="text-slate-400 mb-6">هل أنت متأكد من حذف هذا الكتاب؟</p>
            <div className="flex gap-3">
              <button
                onClick={() => { onDeleteBook(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
              >
                حذف
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
