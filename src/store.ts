import { User, Book, ActivityLog, ReadingProgress } from './types';

const STORAGE_KEYS = {
  USERS: 'library_users',
  BOOKS: 'library_books',
  ACTIVITIES: 'library_activities',
  PROGRESS: 'library_progress',
  CURRENT_USER: 'library_current_user',
};

// Initialize default admin user
export function initializeStore() {
  const users = getUsers();
  if (users.length === 0) {
    const adminUser: User = {
      id: 'admin-1',
      username: 'A',
      password: '1',
      role: 'admin',
      active: true,
      createdAt: new Date().toISOString(),
    };
    saveUsers([adminUser]);
  }
}

// Users
export function getUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function addUser(user: User) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(userId: string, updates: Partial<User>) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
}

export function deleteUser(userId: string) {
  const users = getUsers().filter(u => u.id !== userId);
  saveUsers(users);
}

export function authenticateUser(username: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user && user.active) return user;
  return null;
}

// Books
export function getBooks(): Book[] {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
  return data ? JSON.parse(data) : [];
}

export function saveBooks(books: Book[]) {
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
}

export function addBook(book: Book) {
  const books = getBooks();
  books.push(book);
  saveBooks(books);
}

export function updateBook(bookId: string, updates: Partial<Book>) {
  const books = getBooks();
  const index = books.findIndex(b => b.id === bookId);
  if (index !== -1) {
    books[index] = { ...books[index], ...updates };
    saveBooks(books);
  }
}

export function deleteBook(bookId: string) {
  const books = getBooks().filter(b => b.id !== bookId);
  saveBooks(books);
}

// Activities
export function getActivities(): ActivityLog[] {
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  return data ? JSON.parse(data) : [];
}

export function addActivity(activity: ActivityLog) {
  const activities = getActivities();
  activities.unshift(activity);
  if (activities.length > 500) activities.pop();
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
}

// Reading Progress
export function getProgress(): ReadingProgress[] {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : [];
}

export function getProgressByUser(userId: string): ReadingProgress[] {
  return getProgress().filter(p => p.userId === userId);
}

export function updateProgress(progress: ReadingProgress) {
  const allProgress = getProgress();
  const index = allProgress.findIndex(
    p => p.userId === progress.userId && p.bookId === progress.bookId
  );
  if (index !== -1) {
    allProgress[index] = progress;
  } else {
    allProgress.push(progress);
  }
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
}

// Current User
export function getCurrentUser(): User | null {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}
