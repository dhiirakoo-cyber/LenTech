import { Language } from '../types';
import { translations } from '../translations';
import { ArrowRight, Sparkles, Star, Award, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  lang: Language;
  onExplore: () => void;
  onRegister: () => void;
}

export function Hero({ lang, onExplore, onRegister }: HeroProps) {
  const t = translations[lang];

  return (
    <div className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 border-b border-gray-100 dark:border-gray-850 transition-colors duration-200">
      {/* Visual glowing aura circles */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text details */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
            {/* Promo banner item */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-secondary/10 dark:bg-primary/10 border border-secondary/20 dark:border-primary/20 px-3 py-1.5 rounded-full text-xs font-bold text-secondary dark:text-primary tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Harar Digital Mastery Academy 2026</span>
            </motion.div>

            {/* Core Display Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight"
            >
              Technology & Business{' '}
              <span className="bg-gradient-to-r from-secondary via-blue-600 to-indigo-600 dark:from-primary dark:to-amber-500 bg-clip-text text-transparent">
                Learning Platform
              </span>
            </motion.h1>

            {/* Subtitle description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              {t.heroSubtitle}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white font-display font-bold px-7 py-4 rounded-xl shadow-lg shadow-secondary/10 dark:shadow-primary/5 hover:shadow-xl transition-all cursor-pointer hover:scale-[1.01]"
              >
                {t.btnExploreCourses}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRegister}
                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 font-display font-bold px-7 py-4 rounded-xl transition-all cursor-pointer"
              >
                {t.btnRegisterNow}
              </button>
            </motion.div>

            {/* Small trust features panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 pt-4 md:pt-6 border-t border-gray-100 dark:border-gray-800/80 text-center lg:text-left text-xs text-gray-400"
            >
              <div className="space-y-1">
                <span className="text-gray-900 dark:text-white font-black text-base sm:text-lg block">4</span>
                <span className="block font-medium">Bilingual Courses</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-900 dark:text-white font-black text-base sm:text-lg block">100%</span>
                <span className="block font-medium">Practical Skills</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-900 dark:text-white font-black text-base sm:text-lg block">Offline PDF</span>
                <span className="block font-medium">Syllabus Included</span>
              </div>
            </motion.div>
          </div>

          {/* Right Graphics Illustration */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square w-full rounded-3xl bg-slate-900 overflow-hidden border border-slate-800 p-8 shadow-2xl flex flex-col justify-between"
            >
              {/* Grid Background Lines inside terminal card */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>

              {/* Decorative top dot buttons */}
              <div className="flex gap-1.5 items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-[10px] font-mono text-slate-500 ml-2">AMANUEL_ACADEMY.sh</span>
              </div>

              {/* Central Vector Tech Graphics */}
              <div className="my-auto space-y-6 text-center">
                <div className="relative w-28 h-28 mx-auto">
                  <div className="absolute inset-0 bg-primary/25 rounded-full blur-xl animate-pulse"></div>
                  <div className="bg-slate-800 border-2 border-primary w-full h-full rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                    <Zap className="w-12 h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-white text-lg">Learn Digital & Business</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Master Photo Editing, Vector Design, Customer Service CRM, and Facebook/Telegram growth marketing.
                  </p>
                </div>
              </div>

              {/* Bottom analytics mock stats */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-white font-bold">Harar Kebele 02 Hub</span>
                </div>
                <span className="text-emerald-500 font-bold font-mono">LIVE CONNECTED</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
