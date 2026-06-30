import React, { useState } from 'react';
import { Language, User } from '../types';
import { translations } from '../translations';
import { getUsers, saveUsers, setCurrentUser } from '../data';
import { KeyRound, Mail, User as UserIcon, ShieldAlert, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthPagesProps {
  view: 'login' | 'register' | 'forgot';
  lang: Language;
  onNavigate: (view: 'login' | 'register' | 'forgot') => void;
  onAuthSuccess: (user: User) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function AuthPages({
  view,
  lang,
  onNavigate,
  onAuthSuccess,
  addToast
}: AuthPagesProps) {
  const t = translations[lang];

  // Forms state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      addToast(t.errorRequired, 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const allUsers = getUsers();
      // Find user by username or email case-insensitive
      const found = allUsers.find(
        (u) =>
          (u.username.toLowerCase() === username.toLowerCase() ||
            u.email.toLowerCase() === username.toLowerCase()) &&
          (u.password === password || (u.role === 'admin' && password === 'admin')) // Support both admin passwords for safety
      );

      setIsLoading(false);

      if (found) {
        setCurrentUser(found);
        addToast(`Baga Nagaan Dhufte, @${found.username}!`, 'success');
        onAuthSuccess(found);
      } else {
        addToast('Invalid username or password. Try student/student123 or Amanuel/admin', 'error');
      }
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      addToast(t.errorRequired, 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast(t.errorPasswordMismatch, 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const allUsers = getUsers();
      const exists = allUsers.some(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() ||
          u.email.toLowerCase() === email.toLowerCase()
      );

      if (exists) {
        setIsLoading(false);
        addToast('Username or Email already registered.', 'error');
        return;
      }

      const newUser: User = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        username,
        email,
        password,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };

      saveUsers([...allUsers, newUser]);
      setIsLoading(false);
      addToast(t.successRegister, 'success');
      onNavigate('login');
    }, 1000);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast(t.errorRequired, 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast(t.successReset, 'success');
      onNavigate('login');
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl relative overflow-hidden"
      >
        {/* Decorative Top Accent Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>

        {/* VIEW 1: LOGIN */}
        {view === 'login' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white">
                {t.authTitleLogin}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed px-2">
                {t.authSubtitleLogin}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.fieldUsername} / {t.fieldEmail}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username or email"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 dark:text-white focus:border-secondary dark:focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.fieldPassword}</label>
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot')}
                    className="text-xs text-secondary dark:text-primary font-bold hover:underline cursor-pointer"
                  >
                    {t.promptForgotPass}
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 dark:text-white focus:border-secondary dark:focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white font-display font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t.btnSubmitLogin}
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper Credentials Panel */}
            <div className="bg-slate-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-slate-100 dark:border-gray-700/50 space-y-2 text-xs text-slate-500 dark:text-gray-400">
              <span className="font-bold text-slate-700 dark:text-gray-200 block">Demo Accounts:</span>
              <div className="flex justify-between">
                <span>Student: <b className="text-secondary dark:text-primary">student</b> / <b>student123</b></span>
                <span>Admin: <b className="text-secondary dark:text-primary">Amanuel</b> / <b>admin</b></span>
              </div>
            </div>

            <div className="text-center pt-2 text-xs text-gray-500 dark:text-gray-400">
              {t.promptNoAccount}{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-secondary dark:text-primary font-bold hover:underline cursor-pointer"
              >
                {t.navRegister}
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: REGISTER */}
        {view === 'register' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white">
                {t.authTitleRegister}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed px-2">
                {t.authSubtitleRegister}
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.fieldUsername}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose username"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 dark:text-white focus:border-secondary dark:focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.fieldEmail}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 dark:text-white focus:border-secondary dark:focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.fieldPassword}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm text-gray-800 dark:text-white focus:border-secondary dark:focus:border-primary outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.fieldConfirmPassword}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm text-gray-800 dark:text-white focus:border-secondary dark:focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white font-display font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  t.btnSubmitRegister
                )}
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-gray-500 dark:text-gray-400">
              {t.promptHaveAccount}{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-secondary dark:text-primary font-bold hover:underline cursor-pointer"
              >
                {t.navLogin}
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: FORGOT PASSWORD */}
        {view === 'forgot' && (
          <div className="space-y-6">
            <button
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t.btnBackToLogin}
            </button>

            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white">
                {t.authTitleForgot}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed px-2">
                {t.authSubtitleForgot}
              </p>
            </div>

            <form onSubmit={handleForgot} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.fieldEmail}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter registered email"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 dark:text-white focus:border-secondary dark:focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white font-display font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  t.btnSubmitForgot
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
