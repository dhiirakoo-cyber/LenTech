export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'student';
  avatar?: string;
}

export interface Course {
  id: string;
  titleEn: string;
  titleOm: string;
  descEn: string;
  descOm: string;
  durationEn: string;
  durationOm: string;
  levelEn: string;
  levelOm: string;
  price: number; // in Ethiopian Birr (ETB)
  pdfIncluded: boolean;
  category: 'editing' | 'design' | 'training' | 'marketing';
  lessons: {
    id: string;
    titleEn: string;
    titleOm: string;
    duration: string;
    videoUrl?: string;
  }[];
}

export interface Payment {
  id: string;
  userId: string;
  username: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  method: 'telebirr' | 'cbe';
  screenshotUrl: string; // Base64 string or mock image url
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  rejectionReason?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  dateEnrolled: string;
}

export type Language = 'en' | 'om';
export type Theme = 'light' | 'dark';
