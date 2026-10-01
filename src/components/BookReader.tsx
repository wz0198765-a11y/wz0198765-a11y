import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, BookOpen, Clock, X, Maximize2, Minimize2 } from 'lucide-react';
import { Book, User } from '../types';

interface BookReaderProps {
  book: Book;
  currentUser: User;
  onClose: () => void;
  onProgressUpdate: (bookId: string, currentPage: number, timeSpent: number) => void;
}

export default function BookReader({ book, currentUser, onClose, onProgressUpdate }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const startTimeRef = useRef(Date.now());
  const totalPages = book.pages || 20;

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (elapsed > 0) {
        onProgressUpdate(book.id, currentPage, elapsed);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPage, book.id]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate sample content for each page
  const getPageContent = (page: number) => {
    if (book.content) {
      const pages = book.content.split('---PAGE---');
      if (pages[page - 1]) return pages[page - 1];
    }
    return `هذا هو محتوى الصفحة ${page} من كتاب "${book.title}" للمؤلف ${book.author}.\n\nيمكنك التنقل بين الصفحات باستخدام الأزرار في الأسفل. يتم حفظ تقدمك تلقائياً.\n\nاستمتع بالقراءة!`;
  };

  const progress = (currentPage / totalPages) * 100;

  return (
    <div className={`fixed inset-0 z-50 ${isFullscreen ? 'bg-slate-950' : 'bg-slate-900/95 backdrop-blur-sm'}`}>
      <div className={`h-full flex flex-col ${isFullscreen ? 'max-w-none mx-0' : 'max-w-4xl mx-auto'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white">{book.title}</h2>
              <p className="text-sm text-slate-400">{book.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-slate-300">صفحة {currentPage} من {totalPages}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="px-2 py-1 text-sm bg-slate-800/50 rounded text-slate-300 hover:bg-slate-700"
              >
                أ-
              </button>
              <button
                onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                className="px-2 py-1 text-sm bg-slate-800/50 rounded text-slate-300 hover:bg-slate-700"
              >
                أ+
              </button>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5 text-slate-400" /> : <Maximize2 className="w-5 h-5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-l from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className="max-w-2xl mx-auto">
            <div
              className="text-slate-200 leading-relaxed whitespace-pre-wrap"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
            >
              {getPageContent(currentPage)}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700/50">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            الصفحة السابقة
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center py-1 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            <span className="text-sm text-slate-400">/ {totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            الصفحة التالية
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
