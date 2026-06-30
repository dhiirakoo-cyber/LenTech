import { Course, User, Payment, Enrollment } from './types';

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-photo-editing',
    titleEn: 'Photo Editing Mastery Course',
    titleOm: 'Leenjii Gulaala Fakkii (Photo Editing)',
    descEn: 'Learn premium Adobe Photoshop & Lightroom techniques. Edit portraits, manipulate backgrounds, and color grade like a professional.',
    descOm: 'Tooftaalee Adobe Photoshop & Lightroom beekamoo baradhu. Fakkii namaa gulaali, duubbee sirreessi, akkasumas halluu akka ogeessaatti dambalisi.',
    durationEn: '8 Hours of High Quality Video',
    durationOm: 'Viidiyoo Qulqullina Qabu Sa\'aatii 8',
    levelEn: 'Beginner to Advanced',
    levelOm: 'Eegaltuu irraa hanga Olaanaatti',
    price: 1500,
    pdfIncluded: true,
    category: 'editing',
    lessons: [
      { id: 'pe-1', titleEn: 'Introduction to Photoshop Workspace', titleOm: 'Seensa Photoshop fi Bakka Hojii', duration: '15 mins' },
      { id: 'pe-2', titleEn: 'Mastering Layers and Layer Masks', titleOm: 'Layers fi Layer Masks Ogummaan Bulchuu', duration: '25 mins' },
      { id: 'pe-3', titleEn: 'Portrait Retouching & Skin Smoothing', titleOm: 'Fakkii Gulaaluu fi Gogaa Bareechuu', duration: '40 mins' },
      { id: 'pe-4', titleEn: 'Advanced Background Replacement', titleOm: 'Duubbee (Background) Jijjiiruu Fi Makuu', duration: '35 mins' },
      { id: 'pe-5', titleEn: 'Color Grading & Lighting Adjustments', titleOm: 'Halluu Sirreessuu fi Haala Ifaa', duration: '30 mins' }
    ]
  },
  {
    id: 'course-logo-design',
    titleEn: 'Professional Logo Design & Branding',
    titleOm: 'Leenjii Dizaayinii Loogoo fi Beeksisaa',
    descEn: 'Master vector design in Adobe Illustrator. Create iconic logos, brand identity guidelines, and export high-quality corporate assets.',
    descOm: 'Adobe Illustrator keessatti dizaayinii veektarii baradhu. Loogoowwan bebbeekamoo, qajeelfama beeksisa herregaa uumi, ragaalee daldalaa ergi.',
    durationEn: '10 Hours of Intensive Lessons',
    durationOm: 'Leenjii Giddu-galeessa Sa\'aatii 10',
    levelEn: 'All Levels Welcome',
    levelOm: 'Sadarkaa Hundumaaf kan ta\'u',
    price: 1800,
    pdfIncluded: true,
    category: 'design',
    lessons: [
      { id: 'ld-1', titleEn: 'The Principles of Great Logo Design', titleOm: 'Qajeelfama Dizaayinii Loogoo Gaarii', duration: '20 mins' },
      { id: 'ld-2', titleEn: 'Vector Pen Tool & Geometry Mastery', titleOm: 'Vector Pen Tool fi Master Geometrii', duration: '45 mins' },
      { id: 'ld-3', titleEn: 'Typography Pairing & Brand Systems', titleOm: 'Typography Makuu fi Sirna Maqaa Daldalaa', duration: '35 mins' },
      { id: 'ld-4', titleEn: 'Designing Abstract & Iconic Logos', titleOm: 'Loogoo Abstract fi Iconic Dizaayini Gochuu', duration: '50 mins' },
      { id: 'ld-5', titleEn: 'Client Presentation & Branding Book PDF', titleOm: 'Waraqaa Beeksisaa fi Qajeelfama PDF Ergachuu', duration: '30 mins' }
    ]
  },
  {
    id: 'course-contact-center',
    titleEn: 'Contact Center Customer Service Expert',
    titleOm: 'Leenjii Ogeessa Kontak Seentarii fi Tajaajila Barataa',
    descEn: 'Develop outstanding communication skills, resolve conflicts, manage high-volume calls, and use professional CRM software systems.',
    descOm: 'Dandeettii qunnamtii nama dinqisiisu gabbifadhu, wal-dhabdee hiiki, bilbila hedduu bulchi, akkasumas sooftiweerii CRM hojjedhu.',
    durationEn: '6 Hours of Practice Drills',
    durationOm: 'Shaakala Qabatamaa Sa\'aatii 6',
    levelEn: 'Beginner',
    levelOm: 'Eegaltuu',
    price: 1200,
    pdfIncluded: true,
    category: 'training',
    lessons: [
      { id: 'cc-1', titleEn: 'Introduction to Contact Center Operations', titleOm: 'Seensa Kontak Seentarii fi Hojiiwwan', duration: '15 mins' },
      { id: 'cc-2', titleEn: 'Active Listening & Customer Care Psychology', titleOm: 'Dhagahuu fi Haala Sammuu Barataa Tajaajiluu', duration: '30 mins' },
      { id: 'cc-3', titleEn: 'Handling Difficult Calls & Conflict Resolution', titleOm: 'Bilbila Cimaa fi Wal-dhabdee Hiikuu', duration: '45 mins' },
      { id: 'cc-4', titleEn: 'Using Professional CRM Platforms & Tools', titleOm: 'Sooftiweerii CRM fi Meeshaalee Gargaarsaa', duration: '35 mins' },
      { id: 'cc-5', titleEn: 'KPIs, Call Metrics, and Performance Growth', titleOm: 'KPI, Safartuulee Bilbilaa, fi Guddina Hojii', duration: '25 mins' }
    ]
  },
  {
    id: 'course-social-media',
    titleEn: 'Social Media Management & Digital Marketing',
    titleOm: 'Bulchiinsa Miidiyaa Hawaasaa fi Dijitaal Maarketiingii',
    descEn: 'Grow accounts on Telegram, TikTok, and Facebook. Create engaging content schedules, run ads, and analyze core performance metrics.',
    descOm: 'Telegraama, TikTok, fi Facebook irratti herregoota guddisi. Qophii qabiyyee hawataa uumi, beeksisa hojjedhu, herregoota safari.',
    durationEn: '12 Hours of Step-by-Step Tactics',
    durationOm: 'Tooftaalee Adeemsa-Adeemsaan Sa\'aatii 12',
    levelEn: 'Intermediate',
    levelOm: 'Giddu-galeessa',
    price: 2000,
    pdfIncluded: true,
    category: 'marketing',
    lessons: [
      { id: 'sm-1', titleEn: 'Understanding Algorithms (Telegram, TikTok, Meta)', titleOm: 'Hubannoo Algorithm (Telegram, TikTok, Facebook)', duration: '25 mins' },
      { id: 'sm-2', titleEn: 'Content Strategy & Calendar Creation', titleOm: 'Tooftaa Qabiyyee fi Karoorfannoo Qopheessuu', duration: '35 mins' },
      { id: 'sm-3', titleEn: 'Copywriting and Graphic Creation Secrets', titleOm: 'Iccitii Barreeffama Hawataa fi Giraafiksii', duration: '40 mins' },
      { id: 'sm-4', titleEn: 'Running Paid Campaigns & FB/Telegram Ads', titleOm: 'Beeksisa Kaffaltii fi Meta/Telegram Ads Hojechuu', duration: '55 mins' },
      { id: 'sm-5', titleEn: 'Analytics, Retargeting, and Client Reporting', titleOm: 'Istaatistiksii, Gabaasa fi Guddina Daldalaa', duration: '35 mins' }
    ]
  }
];

// Predefined User accounts
export const DEFAULT_USERS: User[] = [
  {
    id: 'user-admin',
    username: 'Amanuel',
    email: 'dhiirakoo@gmail.com',
    password: 'admin', // Keep it simple for simulation
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-student',
    username: 'student',
    email: 'student@example.com',
    password: 'student123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  }
];

// Seed initial DB in local storage
export const initStorage = () => {
  if (!localStorage.getItem('tb_courses')) {
    localStorage.setItem('tb_courses', JSON.stringify(DEFAULT_COURSES));
  }
  if (!localStorage.getItem('tb_users')) {
    localStorage.setItem('tb_users', JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem('tb_payments')) {
    // Let's seed a couple of sample payments to populate the Admin Dashboard beautifully
    const initialPayments: Payment[] = [
      {
        id: 'pay-sample-1',
        userId: 'user-student',
        username: 'student',
        courseId: 'course-photo-editing',
        courseTitle: 'Photo Editing Mastery Course',
        amount: 1500,
        method: 'telebirr',
        screenshotUrl: 'https://images.unsplash.com/photo-1616077168712-fc6c788bc4ee?w=400&auto=format&fit=crop&q=80', // visual placeholder receipt
        status: 'approved',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
      },
      {
        id: 'pay-sample-2',
        userId: 'user-student',
        username: 'student',
        courseId: 'course-logo-design',
        courseTitle: 'Professional Logo Design & Branding',
        amount: 1800,
        method: 'cbe',
        screenshotUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400&auto=format&fit=crop&q=80',
        status: 'pending',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
      }
    ];
    localStorage.setItem('tb_payments', JSON.stringify(initialPayments));
  }
  if (!localStorage.getItem('tb_enrollments')) {
    // Seed approved enrollment
    const initialEnrollments: Enrollment[] = [
      {
        id: 'enroll-sample-1',
        userId: 'user-student',
        courseId: 'course-photo-editing',
        dateEnrolled: new Date(Date.now() - 86400000 * 3).toLocaleDateString()
      }
    ];
    localStorage.setItem('tb_enrollments', JSON.stringify(initialEnrollments));
  }
};

// Course functions
export const getCourses = (): Course[] => {
  initStorage();
  return JSON.parse(localStorage.getItem('tb_courses') || '[]');
};

export const saveCourses = (courses: Course[]) => {
  localStorage.setItem('tb_courses', JSON.stringify(courses));
};

// User functions
export const getUsers = (): User[] => {
  initStorage();
  return JSON.parse(localStorage.getItem('tb_users') || '[]');
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem('tb_users', JSON.stringify(users));
};

// Payment functions
export const getPayments = (): Payment[] => {
  initStorage();
  return JSON.parse(localStorage.getItem('tb_payments') || '[]');
};

export const savePayments = (payments: Payment[]) => {
  localStorage.setItem('tb_payments', JSON.stringify(payments));
};

// Enrollment functions
export const getEnrollments = (): Enrollment[] => {
  initStorage();
  return JSON.parse(localStorage.getItem('tb_enrollments') || '[]');
};

export const saveEnrollments = (enrollments: Enrollment[]) => {
  localStorage.setItem('tb_enrollments', JSON.stringify(enrollments));
};

// Auth session state
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('tb_current_user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

export const setCurrentUser = (user: User | null) => {
  if (!user) {
    localStorage.removeItem('tb_current_user');
  } else {
    localStorage.setItem('tb_current_user', JSON.stringify(user));
  }
};
