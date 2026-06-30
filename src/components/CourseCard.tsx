import React from 'react';
import { Course, Language } from '../types';
import { BookOpen, Clock, BarChart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { translations } from '../translations';

interface CourseCardProps {
  key?: string;
  course: Course;
  lang: Language;
  onEnroll: (courseId: string) => void;
  isEnrolled: boolean;
  enrollmentStatus?: 'pending' | 'approved' | 'rejected' | null;
  onViewCourse?: (courseId: string) => void;
}

export function CourseCard({
  course,
  lang,
  onEnroll,
  isEnrolled,
  enrollmentStatus,
  onViewCourse
}: CourseCardProps) {
  const t = translations[lang];

  // Render highly polished inline SVG thumbnails based on category
  const renderThumbnail = (category: string) => {
    switch (category) {
      case 'editing':
        return (
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="editGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#311042" />
              </linearGradient>
              <radialGradient id="lensGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="400" height="220" fill="url(#editGrad)" />
            {/* Camera Body Concept */}
            <rect x="120" y="70" width="160" height="90" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="4" />
            <rect x="180" y="55" width="40" height="15" rx="4" fill="#fbbf24" />
            {/* Lens */}
            <circle cx="200" cy="115" r="40" fill="#0f172a" stroke="#fbbf24" strokeWidth="3" />
            <circle cx="200" cy="115" r="30" fill="url(#lensGlow)" />
            <circle cx="200" cy="115" r="15" fill="#2563eb" opacity="0.8" />
            <circle cx="192" cy="107" r="4" fill="#ffffff" opacity="0.9" />
            {/* Grid Accents */}
            <line x1="100" y1="115" x2="300" y2="115" stroke="#ffffff" strokeOpacity="0.1" strokeDasharray="5 5" />
            <line x1="200" y1="40" x2="200" y2="190" stroke="#ffffff" strokeOpacity="0.1" strokeDasharray="5 5" />
            {/* Typography Accent */}
            <text x="25" y="45" fill="#fbbf24" fontSize="11" fontFamily="monospace" letterSpacing="2">PHOTO EDITING</text>
            <text x="320" y="195" fill="#ffffff" opacity="0.4" fontSize="12" fontFamily="monospace">RAW 4K</text>
          </svg>
        );
      case 'design':
        return (
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="designGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" fill="url(#designGrad)" />
            {/* Golden Spiral or Vector Nodes */}
            <path d="M 120 150 C 120 70, 280 70, 280 150" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <path d="M 150 150 C 150 100, 250 100, 250 150" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" />
            {/* Pen Tool Nib */}
            <path d="M 200 60 L 220 110 L 210 115 L 200 95 L 190 115 L 180 110 Z" fill="#f8fafc" stroke="#2563eb" strokeWidth="2" />
            <circle cx="200" cy="85" r="3" fill="#2563eb" />
            {/* Vector Nodes */}
            <rect x="115" y="145" width="10" height="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <rect x="275" y="145" width="10" height="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <circle cx="200" cy="110" r="6" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
            {/* Label */}
            <text x="25" y="45" fill="#fbbf24" fontSize="11" fontFamily="monospace" letterSpacing="2">VECTOR DESIGN</text>
            <text x="345" y="195" fill="#ffffff" opacity="0.4" fontSize="12" fontFamily="monospace">SVG</text>
          </svg>
        );
      case 'training':
        return (
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="trainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="100%" stopColor="#022c22" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" fill="url(#trainGrad)" />
            {/* Headset Symbol and Pulse Wave */}
            <circle cx="200" cy="110" r="50" stroke="#fbbf24" strokeWidth="3" strokeDasharray="8 4" />
            <path d="M 140 120 C 140 70, 260 70, 260 120" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            {/* Earpads */}
            <rect x="130" y="110" width="16" height="30" rx="8" fill="#fbbf24" />
            <rect x="254" y="110" width="16" height="30" rx="8" fill="#fbbf24" />
            {/* Mic boom */}
            <path d="M 145 130 Q 170 160 190 155" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <circle cx="193" cy="154" r="5" fill="#fbbf24" />
            {/* Soundwaves */}
            <path d="M 290 100 Q 300 110 290 120" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            <path d="M 300 90 Q 315 110 300 130" stroke="#10b981" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
            {/* Tech Label */}
            <text x="25" y="45" fill="#fbbf24" fontSize="11" fontFamily="monospace" letterSpacing="2">CONTACT CENTER</text>
            <text x="325" y="195" fill="#ffffff" opacity="0.4" fontSize="12" fontFamily="monospace">CRM v5</text>
          </svg>
        );
      case 'marketing':
      default:
        return (
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="marketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#701a75" />
                <stop offset="100%" stopColor="#2e1065" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" fill="url(#marketGrad)" />
            {/* Marketing Chart & Social Symbols */}
            <path d="M 80 160 L 150 120 L 220 140 L 320 80" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="80" cy="160" r="6" fill="#fbbf24" />
            <circle cx="150" cy="120" r="6" fill="#fbbf24" />
            <circle cx="220" cy="140" r="6" fill="#fbbf24" />
            <circle cx="320" cy="80" r="8" fill="#fbbf24" />
            {/* Grid background */}
            <line x1="80" y1="180" x2="320" y2="180" stroke="#ffffff" strokeOpacity="0.2" />
            <line x1="80" y1="50" x2="80" y2="180" stroke="#ffffff" strokeOpacity="0.2" />
            {/* Little circles representing Social Media bubbles */}
            <circle cx="110" cy="70" r="18" fill="#2563eb" opacity="0.8" />
            <text x="105" y="74" fill="#ffffff" fontSize="10" fontWeight="bold">f</text>
            
            <circle cx="280" cy="140" r="18" fill="#0088cc" opacity="0.8" />
            <text x="273" y="144" fill="#ffffff" fontSize="9" fontWeight="bold">tg</text>
            {/* Label */}
            <text x="25" y="45" fill="#fbbf24" fontSize="11" fontFamily="monospace" letterSpacing="2">SOCIAL MARKETING</text>
            <text x="325" y="195" fill="#ffffff" opacity="0.4" fontSize="12" fontFamily="monospace">GROWTH</text>
          </svg>
        );
    }
  };

  const title = lang === 'en' ? course.titleEn : course.titleOm;
  const description = lang === 'en' ? course.descEn : course.descOm;
  const duration = lang === 'en' ? course.durationEn : course.durationOm;
  const level = lang === 'en' ? course.levelEn : course.levelOm;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
        {renderThumbnail(course.category)}
        <div className="absolute top-4 right-4 bg-gray-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary font-sans border border-primary/20">
          {course.price} {t.currency}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-secondary dark:group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-sans line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Technical Specs */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700/50 space-y-3.5 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-secondary dark:text-primary shrink-0" />
            <span className="font-sans font-medium">{t.courseDuration}: <span className="text-gray-800 dark:text-gray-200">{duration}</span></span>
          </div>
          <div className="flex items-center gap-3">
            <BarChart className="w-4 h-4 text-secondary dark:text-primary shrink-0" />
            <span className="font-sans font-medium">{t.courseLevel}: <span className="text-gray-800 dark:text-gray-200">{level}</span></span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-secondary dark:text-primary shrink-0" />
            <span className="font-sans font-medium text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              {course.pdfIncluded ? t.pdfIncluded : t.pdfNotIncluded}
            </span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 pt-2">
          {isEnrolled ? (
            enrollmentStatus === 'approved' ? (
              <button
                onClick={() => onViewCourse && onViewCourse(course.id)}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-semibold py-3 px-4 rounded-xl shadow-md shadow-emerald-500/10 cursor-pointer transition-all duration-200"
              >
                <ShieldCheck className="w-4 h-4" />
                {t.accessCourseBtn}
              </button>
            ) : enrollmentStatus === 'pending' ? (
              <button
                disabled
                className="w-full inline-flex items-center justify-center bg-amber-500/10 dark:bg-amber-400/5 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-sans font-semibold py-3 px-4 rounded-xl cursor-not-allowed transition-all duration-200"
              >
                <span className="animate-pulse mr-2">●</span>
                {t.statusPending}
              </button>
            ) : (
              // Rejected, allow re-submitting payment
              <button
                onClick={() => onEnroll(course.id)}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-sans font-semibold py-3 px-4 rounded-xl shadow-md cursor-pointer transition-all duration-200"
              >
                {t.statusRejected} ({t.btnEnroll})
              </button>
            )
          ) : (
            <button
              onClick={() => onEnroll(course.id)}
              className="w-full inline-flex items-center justify-center bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white font-sans font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer"
            >
              {t.btnEnroll}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
