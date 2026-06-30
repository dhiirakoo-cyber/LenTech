import { Language, Theme, User } from '../types';
import { translations } from '../translations';
import { Sun, Moon, Menu, X, GraduationCap, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  currentPath: string;
  lang: Language;
  theme: Theme;
  user: User | null;
  onSetLang: (lang: Language) => void;
  onToggleTheme: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export function Navbar({
  currentPath,
  lang,
  theme,
  user,
  onSetLang,
  onToggleTheme,
  onNavigate,
  onLogout
}: NavbarProps) {
  const t = translations[lang];
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: t.navHome, path: '#/' },
    { label: t.navCourses, path: '#/courses' },
    { label: t.navAbout, path: '#/about' },
    { label: t.navContact, path: '#/contact' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-850 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo segment */}
          <div
            onClick={() => handleLinkClick('#/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-gradient-to-tr from-secondary to-blue-500 dark:from-primary dark:to-amber-500 p-2.5 rounded-xl text-white dark:text-dark shadow-md group-hover:scale-[1.03] transition-all">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-secondary dark:group-hover:text-primary transition-colors">
              {t.appName}
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5 font-sans">
            {links.map((link) => {
              const isActive = currentPath === link.path || (link.path === '#/' && currentPath === '#');
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'text-secondary dark:text-primary bg-secondary/5 dark:bg-primary/5'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Control Panel Actions */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* Language Switcher */}
            <div className="flex bg-gray-100 dark:bg-gray-850 p-1 rounded-xl border border-gray-200/40 dark:border-gray-700/50">
              <button
                onClick={() => onSetLang('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onSetLang('om')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  lang === 'om'
                    ? 'bg-white dark:bg-gray-800 text-gray-950 dark:text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                OM
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2.5 bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl transition-all cursor-pointer"
              title={t.toggleTheme}
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Auth Session */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLinkClick('#/dashboard')}
                  className="bg-secondary/10 hover:bg-secondary/20 dark:bg-primary/10 dark:hover:bg-primary/20 text-secondary dark:text-primary px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.navDashboard}
                </button>
                <button
                  onClick={onLogout}
                  className="p-2.5 bg-gray-100 dark:bg-gray-850 hover:bg-rose-500/10 hover:text-rose-500 text-gray-500 rounded-xl transition-all cursor-pointer"
                  title={t.logout}
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLinkClick('#/login')}
                  className="px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  {t.navLogin}
                </button>
                <button
                  onClick={() => handleLinkClick('#/register')}
                  className="bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {t.navRegister}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls Trigger (Hamburger) */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Lang switcher direct */}
            <button
              onClick={() => onSetLang(lang === 'en' ? 'om' : 'en')}
              className="px-2 py-1 text-xs font-black bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              {lang === 'en' ? 'OM' : 'EN'}
            </button>

            {/* Menu burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Collapsible Menu) */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-4 shadow-xl transition-colors">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'text-secondary bg-secondary/10 dark:text-primary dark:bg-primary/10'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => handleLinkClick('#/dashboard')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-secondary dark:bg-primary text-white dark:text-dark py-3 px-4 rounded-xl text-sm font-bold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.navDashboard}
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-3 px-4 rounded-xl text-sm font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleLinkClick('#/login')}
                  className="w-full text-center py-3 px-4 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50"
                >
                  {t.navLogin}
                </button>
                <button
                  onClick={() => handleLinkClick('#/register')}
                  className="w-full text-center bg-secondary dark:bg-primary text-white dark:text-dark py-3 px-4 rounded-xl text-sm font-bold shadow"
                >
                  {t.navRegister}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
