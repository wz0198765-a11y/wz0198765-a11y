import { useState, useEffect } from 'react';
import { User, Book, ActivityLog as ActivityLogType, ReadingProgress } from './types';
import {
  initializeStore,
  getUsers,
  getBooks,
  getActivities,
  getProgress,
  authenticateUser,
  addUser as storeAddUser,
  updateUser as storeUpdateUser,
  deleteUser as storeDeleteUser,
  addBook as storeAddBook,
  updateBook as storeUpdateBook,
  deleteBook as storeDeleteBook,
  addActivity,
  updateProgress,
  getCurrentUser,
  setCurrentUser,
} from './store';
import Login from './components/Login';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import BookReader from './components/BookReader';
import UserManagement from './components/UserManagement';
import BookManagement from './components/BookManagement';
import ActivityLog from './components/ActivityLog';
import Settings from './components/Settings';
import FileTree from './components/FileTree';

function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [activities, setActivities] = useState<ActivityLogType[]>([]);
  const [progress, setProgress] = useState<ReadingProgress[]>([]);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize
  useEffect(() => {
    initializeStore();
    const savedUser = getCurrentUser();
    if (savedUser) {
      // Verify user still exists and is active
      const allUsers = getUsers();
      const validUser = allUsers.find(u => u.id === savedUser.id && u.active);
      if (validUser) {
        setCurrentUserState(validUser);
      } else {
        setCurrentUser(null);
      }
    }
    refreshData();
    setIsInitialized(true);
  }, []);

  const refreshData = () => {
    setUsers(getUsers());
    setBooks(getBooks());
    setActivities(getActivities());
    setProgress(getProgress());
  };

  const handleLogin = (username: string, password: string): boolean => {
    const user = authenticateUser(username, password);
    if (user) {
      setCurrentUserState(user);
      setCurrentUser(user);
      addActivity({
        id: `act-${Date.now()}`,
        userId: user.id,
        username: user.username,
        action: 'تسجيل دخول',
        timestamp: new Date().toISOString(),
      });
      refreshData();
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    if (currentUser) {
      addActivity({
        id: `act-${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        action: 'تسجيل خروج',
        timestamp: new Date().toISOString(),
      });
    }
    setCurrentUserState(null);
    setCurrentUser(null);
    setCurrentPage('home');
    refreshData();
  };

  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    storeAddUser(newUser);
    addActivity({
      id: `act-${Date.now()}`,
      userId: currentUser!.id,
      username: currentUser!.username,
      action: 'إضافة مستخدم',
      timestamp: new Date().toISOString(),
    });
    refreshData();
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    storeUpdateUser(userId, updates);
    addActivity({
      id: `act-${Date.now()}`,
      userId: currentUser!.id,
      username: currentUser!.username,
      action: `تعديل مستخدم`,
      timestamp: new Date().toISOString(),
    });
    // If updating current user, refresh their data
    if (userId === currentUser?.id) {
      const updatedUsers = getUsers();
      const updated = updatedUsers.find(u => u.id === userId);
      if (updated) {
        setCurrentUserState(updated);
        setCurrentUser(updated);
      }
    }
    refreshData();
  };

  const handleDeleteUser = (userId: string) => {
    storeDeleteUser(userId);
    addActivity({
      id: `act-${Date.now()}`,
      userId: currentUser!.id,
      username: currentUser!.username,
      action: 'حذف مستخدم',
      timestamp: new Date().toISOString(),
    });
    refreshData();
  };

  const handleAddBook = (bookData: Omit<Book, 'id' | 'uploadedAt' | 'downloads' | 'reads'>) => {
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      downloads: 0,
      reads: 0,
    };
    storeAddBook(newBook);
    addActivity({
      id: `act-${Date.now()}`,
      userId: currentUser!.id,
      username: currentUser!.username,
      action: 'رفع كتاب',
      bookId: newBook.id,
      bookTitle: newBook.title,
      timestamp: new Date().toISOString(),
    });
    refreshData();
  };

  const handleUpdateBook = (bookId: string, updates: Partial<Book>) => {
    storeUpdateBook(bookId, updates);
    refreshData();
  };

  const handleDeleteBook = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    storeDeleteBook(bookId);
    addActivity({
      id: `act-${Date.now()}`,
      userId: currentUser!.id,
      username: currentUser!.username,
      action: 'حذف كتاب',
      bookId: bookId,
      bookTitle: book?.title,
      timestamp: new Date().toISOString(),
    });
    refreshData();
  };

  const handleReadBook = (book: Book) => {
    if (!currentUser) return;
    setReadingBook(book);
    // Update book reads count
    storeUpdateBook(book.id, { reads: book.reads + 1 });
    addActivity({
      id: `act-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      action: 'قراءة',
      bookId: book.id,
      bookTitle: book.title,
      timestamp: new Date().toISOString(),
    });
    refreshData();
  };

  const handleDownloadBook = (book: Book) => {
    if (!currentUser) return;
    // Update book downloads count
    storeUpdateBook(book.id, { downloads: book.downloads + 1 });
    addActivity({
      id: `act-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      action: 'تحميل',
      bookId: book.id,
      bookTitle: book.title,
      timestamp: new Date().toISOString(),
    });
    // Create a text file for download
    const content = book.content || `كتاب: ${book.title}\nالمؤلف: ${book.author}\n\n${book.description}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    refreshData();
  };

  const handleProgressUpdate = (bookId: string, currentPage: number, timeSpent: number) => {
    if (!currentUser) return;
    const book = books.find(b => b.id === bookId);
    const existingProgress = progress.find(p => p.userId === currentUser.id && p.bookId === bookId);
    const newProgress: ReadingProgress = {
      userId: currentUser.id,
      bookId,
      currentPage,
      totalPages: book?.pages || 20,
      timeSpent: (existingProgress?.timeSpent || 0) + timeSpent,
      completed: currentPage >= (book?.pages || 20),
      lastRead: new Date().toISOString(),
    };
    updateProgress(newProgress);
    setProgress(getProgress());
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />

      <main>
        {currentPage === 'home' && (
          <HomePage
            books={books}
            currentUser={currentUser}
            onReadBook={handleReadBook}
            onDownloadBook={handleDownloadBook}
          />
        )}
        {currentPage === 'users' && currentUser.role === 'admin' && (
          <UserManagement
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            currentUser={currentUser}
          />
        )}
        {currentPage === 'books-admin' && currentUser.role === 'admin' && (
          <BookManagement
            books={books}
            currentUser={currentUser}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
          />
        )}
        {currentPage === 'activities' && currentUser.role === 'admin' && (
          <ActivityLog
            activities={activities}
            users={users}
            progress={progress}
            currentUser={currentUser}
          />
        )}
        {currentPage === 'settings' && (
          <Settings
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
          />
        )}
        {currentPage === 'filetree' && (
          <FileTree />
        )}
      </main>

      {/* Book Reader Modal */}
      {readingBook && (
        <BookReader
          book={readingBook}
          currentUser={currentUser}
          onClose={() => setReadingBook(null)}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </div>
  );
}

export default App;
