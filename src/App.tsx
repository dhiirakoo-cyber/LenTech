import React, { useState, useEffect } from 'react';
import { Course, Language, Theme, User, Payment, Enrollment } from './types';
import { translations } from './translations';
import {
  initStorage,
  getCourses,
  getCurrentUser,
  setCurrentUser,
  getEnrollments,
  getPayments
} from './data';

// Component Imports
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { CourseCard } from './components/CourseCard';
import { CourseDetailModal } from './components/CourseDetailModal';
import { PaymentPage } from './components/PaymentPage';
import { DashboardStudent } from './components/DashboardStudent';
import { DashboardAdmin } from './components/DashboardAdmin';
import { AuthPages } from './components/AuthPages';
import { ToastContainer, useToasts } from './components/Toast';

// Lucide Icons
import {
  Phone,
  Mail,
  MapPin,
  Check,
  Copy,
  ArrowRight,
  BookOpen,
  Users,
  Clock,
  Briefcase,
  Star,
  Award,
  Send,
  Sparkles,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  // Initialize storage once on startup
  useEffect(() => {
    initStorage();
  }, []);

  // Global Config States
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('tb_lang');
    return (saved as Language) || 'en';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('tb_theme');
    return (saved as Theme) || 'light';
  });

  const [currentUser, setCurrentUserState] = useState<User | null>(() => getCurrentUser());
  const [courses, setCourses] = useState<Course[]>(() => getCourses());
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.hash || '#/');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'editing' | 'design' | 'training' | 'marketing'>('all');

  // Interactive Flow States
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [activeCoursePlayer, setActiveCoursePlayer] = useState<Course | null>(null);
  const [copiedField, setCopiedField] = useState<'phone' | 'email' | null>(null);

  // Toast System Hook
  const { toasts, addToast, removeToast } = useToasts();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Sync theme with HTML node for Tailwind v4 Dark Mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tb_theme', theme);
  }, [theme]);

  // Sync language with localstorage
  useEffect(() => {
    localStorage.setItem('tb_lang', lang);
  }, [lang]);

  // Listen to hash changes for routing
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    addToast('Logged out successfully.', 'info');
    navigate('#/');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUserState(user);
    if (user.role === 'admin') {
      navigate('#/dashboard');
    } else {
      navigate('#/dashboard');
    }
  };

  const handleEnrollClick = (courseId: string) => {
    if (!currentUser) {
      addToast('Please login or register to enroll in courses.', 'info');
      navigate('#/login');
      return;
    }
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setCheckoutCourse(course);
      navigate('#/payment');
    }
  };

  const handleCopyContact = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    addToast(`${type === 'phone' ? 'Phone number' : 'Email address'} copied!`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      addToast(translations[lang].errorRequired, 'error');
      return;
    }

    addToast(translations[lang].contactSuccess, 'success');
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
  };

  // Reload courses list after admin updates
  const handleRefreshCourses = () => {
    setCourses(getCourses());
  };

  // Translations shortcut
  const t = translations[lang];

  // Filters search on Courses View
  const filteredCourses = courses.filter(course => {
    const title = lang === 'en' ? course.titleEn : course.titleOm;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 flex flex-col transition-colors duration-200">
      {/* Toast notifications container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Persistent Navigation */}
      <Navbar
        currentPath={currentPath}
        lang={lang}
        theme={theme}
        user={currentUser}
        onSetLang={setLang}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      {/* Main Core Router Body */}
      <main className="flex-1">
        {/* VIEW A: HOME PAGE */}
        {(currentPath === '#/' || currentPath === '#' || currentPath === '') && (
          <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <Hero
              lang={lang}
              onExplore={() => navigate('#/courses')}
              onRegister={() => navigate('#/register')}
            />

            {/* Courses Highlights Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-3 mb-10">
                <h2 className="font-display text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                  {t.coursesSectionTitle}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                  {t.coursesSectionSubtitle}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.slice(0, 4).map((course) => {
                  const enrollments = getEnrollments().filter(e => e.userId === currentUser?.id);
                  const payments = getPayments().filter(p => p.userId === currentUser?.id);
                  const isEnrolled = enrollments.some(e => e.courseId === course.id);
                  const payStatus = payments.find(p => p.courseId === course.id)?.status;

                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      lang={lang}
                      onEnroll={handleEnrollClick}
                      isEnrolled={isEnrolled || payments.some(p => p.courseId === course.id)}
                      enrollmentStatus={isEnrolled ? 'approved' : payStatus || null}
                      onViewCourse={(id) => {
                        const target = courses.find(c => c.id === id);
                        if (target) {
                          setActiveCoursePlayer(target);
                        }
                      }}
                    />
                  );
                })}
              </div>

              <div className="text-center mt-10">
                <button
                  onClick={() => navigate('#/courses')}
                  className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 font-bold text-sm py-3 px-6 rounded-xl cursor-pointer transition-all"
                >
                  View All Courses Database
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Promo Highlight: About Instructor Short snippet */}
            <div className="bg-gray-100 dark:bg-gray-900/50 py-16 transition-colors">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                  <div className="md:col-span-5 relative">
                    <div className="aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl relative bg-slate-200">
                      <img
                        src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&auto=format&fit=crop&q=80"
                        alt="Instructor Amanuel"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex items-end p-5">
                        <div>
                          <span className="text-xs text-primary font-bold block uppercase tracking-wider">Expert Instructor</span>
                          <span className="text-white font-black text-lg block">{t.instructorName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-1.5 text-secondary dark:text-primary text-xs font-bold uppercase tracking-wider">
                      <Award className="w-4 h-4" />
                      <span>Meet Your Instructor</span>
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                      Empowering Learners Through Industry-Ready Training
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      "{t.aboutDescription}"
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                        <span className="text-gray-400 block mb-0.5">Contact Instructor:</span>
                        <span className="font-mono font-bold text-gray-800 dark:text-white">0967145146</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                        <span className="text-gray-400 block mb-0.5">Location Hub:</span>
                        <span className="font-semibold text-gray-800 dark:text-white">Harar, Ethiopia</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('#/about')}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary dark:text-primary hover:underline cursor-pointer"
                    >
                      Read full instructor credentials
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: COURSES GRID CATALOG PAGE */}
        {currentPath === '#/courses' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 md:space-y-12">
            <div className="text-center space-y-3">
              <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                {t.coursesSectionTitle}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                {t.coursesSectionSubtitle}
              </p>
            </div>

            {/* Catalog Filters Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <input
                type="text"
                placeholder={t.courseSearchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:max-w-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-secondary dark:focus:border-primary text-gray-850 dark:text-white"
              />

              {/* Categorization filter */}
              <div className="flex flex-wrap gap-1.5 items-center">
                {(['all', 'editing', 'design', 'training', 'marketing'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-secondary text-white dark:bg-primary dark:text-dark'
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800'
                    }`}
                  >
                    {cat === 'all' ? t.courseCategoryAll : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses grid */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No courses found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCourses.map((course) => {
                  const enrollments = getEnrollments().filter(e => e.userId === currentUser?.id);
                  const payments = getPayments().filter(p => p.userId === currentUser?.id);
                  const isEnrolled = enrollments.some(e => e.courseId === course.id);
                  const payStatus = payments.find(p => p.courseId === course.id)?.status;

                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      lang={lang}
                      onEnroll={handleEnrollClick}
                      isEnrolled={isEnrolled || payments.some(p => p.courseId === course.id)}
                      enrollmentStatus={isEnrolled ? 'approved' : payStatus || null}
                      onViewCourse={(id) => {
                        const target = courses.find(c => c.id === id);
                        if (target) {
                          setActiveCoursePlayer(target);
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW C: ABOUT PAGE */}
        {currentPath === '#/about' && (
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-12">
            {/* Visual Header */}
            <div className="text-center space-y-4">
              <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                {t.aboutTitle}
              </h1>
              <span className="bg-secondary/10 dark:bg-primary/10 text-secondary dark:text-primary text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-widest inline-block">
                Instructor Credentials
              </span>
            </div>

            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
              {/* Image Frame Column */}
              <div className="md:col-span-5 space-y-4">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl relative bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&auto=format&fit=crop&q=80"
                    alt="Amanuel"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Local Contact Cards */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
                  <div className="flex gap-3 items-start text-xs text-gray-500">
                    <MapPin className="w-4 h-4 text-secondary dark:text-primary shrink-0" />
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 block">Harar Kebele 02 office</span>
                      <span>Harar, Ethiopia</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start text-xs text-gray-500">
                    <Phone className="w-4 h-4 text-secondary dark:text-primary shrink-0" />
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 block">Phone</span>
                      <span className="font-mono">{t.instructorPhone}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start text-xs text-gray-500">
                    <Mail className="w-4 h-4 text-secondary dark:text-primary shrink-0" />
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 block">Email Address</span>
                      <span className="font-mono">{t.instructorEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Description Column */}
              <div className="md:col-span-7 space-y-6 leading-relaxed text-sm text-gray-600 dark:text-gray-400 font-sans">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-xl md:text-2xl leading-snug">
                  Instructor {t.instructorName}
                </h3>
                <span className="font-display font-medium text-secondary dark:text-primary text-xs uppercase block tracking-wider">
                  {t.instructorRole}
                </span>

                <p className="mt-4">
                  "{t.aboutDescription}"
                </p>

                <p>
                  With years of hands-on technical experience in Ethiopia, Amanuel bridges digital gaps by offering high-quality, practical training directly tailored to business markets. Courses are designed from scratch using modern digital standards to help youth get hired or launch their design services.
                </p>

                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  What makes our learning environment unique:
                </p>

                <ul className="space-y-3.5 text-xs text-gray-500 list-none pl-0">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span><b>Bicultural Support</b>: Complete English and Afaan Oromoo explanations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span><b>PDF Textbooks</b>: Read and practice with offline guides included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span><b>Manual Bank Verification</b>: Safe and direct payments through Telebirr and CBE</span>
                  </li>
                </ul>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => navigate('#/courses')}
                    className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark text-white font-display font-bold py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {t.btnExploreCourses}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW D: CONTACT PAGE */}
        {currentPath === '#/contact' && (
          <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 space-y-12">
            <div className="text-center space-y-3">
              <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                {t.contactTitle}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                {t.contactSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-start">
              {/* Left Column: Direct Info cards */}
              <div className="md:col-span-2 space-y-4 font-sans text-xs">
                {/* Phone contact card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-secondary dark:text-primary shrink-0" />
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 block text-sm">{t.contactPhone}</span>
                      <span className="font-mono text-gray-500 block mt-1">0967145146</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyContact("0967145146", "phone")}
                    className="w-full inline-flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer"
                  >
                    {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'phone' ? t.copiedFeedback : "Copy Phone"}
                  </button>
                </div>

                {/* Email contact card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-secondary dark:text-primary shrink-0" />
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 block text-sm">{t.contactEmail}</span>
                      <span className="font-mono text-gray-500 block mt-1">dhiirakoo@gmail.com</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyContact("dhiirakoo@gmail.com", "email")}
                    className="w-full inline-flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer"
                  >
                    {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'email' ? t.copiedFeedback : "Copy Email"}
                  </button>
                </div>

                {/* Location address card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex gap-3 text-xs">
                    <MapPin className="w-5 h-5 text-secondary dark:text-primary shrink-0" />
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 block text-sm">{t.contactLocation}</span>
                      <span className="text-gray-500 block mt-1">Harar, Ethiopia, Kebele 02</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Message form */}
              <div className="md:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-xs">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-gray-400 font-bold uppercase tracking-wider block">{t.contactFormName}</label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-secondary dark:focus:border-primary text-gray-850 dark:text-white"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-gray-400 font-bold uppercase tracking-wider block">{t.contactEmail}</label>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-secondary dark:focus:border-primary text-gray-850 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-bold uppercase tracking-wider block">{t.contactFormSubject}</label>
                      <input
                        type="text"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="Subject topic"
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-secondary dark:focus:border-primary text-gray-850 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-bold uppercase tracking-wider block">{t.contactFormMessage}</label>
                      <textarea
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        rows={4}
                        placeholder="Write your messages to Instructor Amanuel here..."
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-secondary dark:focus:border-primary text-gray-850 dark:text-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white font-display font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {t.btnSendMessage}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW E: AUTHENTICATION */}
        {currentPath === '#/login' && (
          <AuthPages
            view="login"
            lang={lang}
            onNavigate={(v) => navigate(`#/${v}`)}
            onAuthSuccess={handleAuthSuccess}
            addToast={addToast}
          />
        )}

        {currentPath === '#/register' && (
          <AuthPages
            view="register"
            lang={lang}
            onNavigate={(v) => navigate(`#/${v}`)}
            onAuthSuccess={handleAuthSuccess}
            addToast={addToast}
          />
        )}

        {currentPath === '#/forgot' && (
          <AuthPages
            view="forgot"
            lang={lang}
            onNavigate={(v) => navigate(`#/${v}`)}
            onAuthSuccess={handleAuthSuccess}
            addToast={addToast}
          />
        )}

        {/* VIEW F: PAYMENT DRAWER PAGE */}
        {currentPath === '#/payment' && checkoutCourse && currentUser && (
          <PaymentPage
            course={checkoutCourse}
            lang={lang}
            userId={currentUser.id}
            username={currentUser.username}
            onBack={() => {
              setCheckoutCourse(null);
              navigate('#/courses');
            }}
            onPaymentSuccess={() => {
              setCheckoutCourse(null);
              addToast('Receipt uploaded successfully!', 'success');
              navigate('#/dashboard');
            }}
            addToast={addToast}
          />
        )}

        {/* VIEW G: DASHBOARDS */}
        {currentPath === '#/dashboard' && (
          <>
            {currentUser ? (
              currentUser.role === 'admin' ? (
                <DashboardAdmin
                  user={currentUser}
                  courses={courses}
                  lang={lang}
                  onLogout={handleLogout}
                  onRefreshCourses={handleRefreshCourses}
                  addToast={addToast}
                />
              ) : (
                <DashboardStudent
                  user={currentUser}
                  courses={courses}
                  lang={lang}
                  onLogout={handleLogout}
                  onViewCourse={(id) => {
                    const target = courses.find(c => c.id === id);
                    if (target) {
                      setActiveCoursePlayer(target);
                    }
                  }}
                  addToast={addToast}
                />
              )
            ) : (
              <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
                <p className="text-gray-500 font-medium">Please login to view dashboard.</p>
                <button
                  onClick={() => navigate('#/login')}
                  className="bg-secondary dark:bg-primary text-white dark:text-dark px-6 py-2 rounded-xl text-sm font-bold shadow-md"
                >
                  {t.navLogin}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Visual active course modal player overlay */}
      {activeCoursePlayer && (
        <CourseDetailModal
          course={activeCoursePlayer}
          lang={lang}
          onClose={() => setActiveCoursePlayer(null)}
          addToast={addToast}
        />
      )}

      {/* Persistent Footer */}
      <Footer lang={lang} onNavigate={navigate} />
    </div>
  );
}
