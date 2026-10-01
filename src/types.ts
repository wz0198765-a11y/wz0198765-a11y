export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  active: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverUrl: string;
  pages: number;
  content: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
  reads: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  bookId?: string;
  bookTitle?: string;
  timestamp: string;
  duration?: number;
  pagesRead?: number;
}

export interface ReadingProgress {
  userId: string;
  bookId: string;
  currentPage: number;
  totalPages: number;
  timeSpent: number;
  completed: boolean;
  lastRead: string;
}
