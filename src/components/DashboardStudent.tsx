import React, { useState } from 'react';
import { Course, Language, User, Payment, Enrollment } from '../types';
import { translations } from '../translations';
import { getEnrollments, getPayments, saveUsers, getUsers, setCurrentUser } from '../data';
import { BookOpen, CreditCard, UserCheck, Download, Award, ShieldCheck, Mail, ShieldAlert, Sparkles, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardStudentProps {
  user: User;
  courses: Course[];
  lang: Language;
  onLogout: () => void;
  onViewCourse: (courseId: string) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

type TabType = 'courses' | 'pdfs' | 'payments' | 'profile';

export function DashboardStudent({
  user,
  courses,
  lang,
  onLogout,
  onViewCourse,
  addToast
}: DashboardStudentProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<TabType>('courses');

  // Load state
  const enrollments = getEnrollments().filter((e) => e.userId === user.id);
  const payments = getPayments().filter((p) => p.userId === user.id);

  // Profile forms
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState('');
  const [avatar, setAvatar] = useState(user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

  const enrolledCourses = courses.filter((c) =>
    enrollments.some((e) => e.courseId === c.id)
  );

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) {
      addToast(t.errorRequired, 'error');
      return;
    }

    const allUsers = getUsers();
    const updatedUsers = allUsers.map((u) => {
      if (u.id === user.id) {
        const updated: User = {
          ...u,
          username,
          email,
          avatar
        };
        if (newPassword) {
          updated.password = newPassword;
        }
        return updated;
      }
      return u;
    });

    saveUsers(updatedUsers);
    const updatedMe = updatedUsers.find((u) => u.id === user.id) || null;
    setCurrentUser(updatedMe);
    addToast(t.profileSuccess, 'success');
  };

  const simulateDownload = (fileName: string, courseId: string) => {
    addToast(`Downloading ${fileName}...`, 'info');
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = 'data:application/pdf;base64,JVBERi0xLjQKJSDi48clNTRiCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNCAwIFIKPj4KPj4KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNSAwIG9iago8PAovTGVuZ3RoIDU1Cj4+CnN0cmVhbQpCVEYxIDEyIFRmCjUwIDcwMCBUZCAoVEItV0VCQVBQOiBDb3Vyc2UgUERGIE1hdGVyaWFsIClTaG93CmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTYgMDAwMDAgbgogMDAwMDAwMDIxMiAwMDAwMCBuIAowMDAwMDAwMjgyIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzk1CiUlRU9GCg==';
      link.download = `${courseId}_material_guide.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast(`Downloaded ${fileName} successfully!`, 'success');
    }, 1000);
  };

  const avatarsList = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans">
      {/* Top Banner section */}
      <div className="bg-gradient-to-r from-secondary/10 to-transparent dark:from-primary/10 dark:to-transparent rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800/60 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="relative w-16 h-16 rounded-full border-4 border-secondary dark:border-primary overflow-hidden shadow-md">
            <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
              Baga Nagaan Dhufte, {username}!
              <Sparkles className="w-5 h-5 text-primary" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t.dashboardStudentSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer"
        >
          {t.logout}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 py-3 px-5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'courses'
              ? 'border-secondary text-secondary dark:border-primary dark:text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {t.tabMyCourses}
        </button>

        <button
          onClick={() => setActiveTab('pdfs')}
          className={`flex items-center gap-2 py-3 px-5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'pdfs'
              ? 'border-secondary text-secondary dark:border-primary dark:text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Download className="w-4 h-4" />
          {t.tabPurchasedPDFs}
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 py-3 px-5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'payments'
              ? 'border-secondary text-secondary dark:border-primary dark:text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          {t.tabPaymentHistory}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 py-3 px-5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'profile'
              ? 'border-secondary text-secondary dark:border-primary dark:text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          {t.tabProfile}
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {/* TAB 1: MY COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">{t.noCoursesYet}</p>
                <a
                  href="#/courses"
                  className="mt-4 inline-block bg-secondary dark:bg-primary text-white dark:text-dark font-bold text-xs py-2.5 px-6 rounded-xl shadow-md transition-all"
                >
                  {t.btnExploreCourses}
                </a>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => {
                  const courseTitle = lang === 'en' ? course.titleEn : course.titleOm;
                  const duration = lang === 'en' ? course.durationEn : course.durationOm;
                  return (
                    <div
                      key={course.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between"
                    >
                      <div className="p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary dark:text-primary px-2 py-0.5 bg-secondary/10 dark:bg-primary/10 rounded-full">
                          {course.category}
                        </span>
                        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mt-3 line-clamp-1">
                          {courseTitle}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">{duration}</p>
                      </div>

                      <div className="p-5 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-850">
                        <button
                          onClick={() => onViewCourse(course.id)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-md transition-all"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {t.accessCourseBtn}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PURCHASED PDFS */}
        {activeTab === 'pdfs' && (
          <div className="space-y-4">
            {enrolledCourses.filter(c => c.pdfIncluded).length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">{t.noPDFsYet}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {enrolledCourses.filter(c => c.pdfIncluded).map((course) => {
                  const courseTitle = lang === 'en' ? course.titleEn : course.titleOm;
                  return (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500 shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-gray-900 dark:text-white block truncate max-w-xs">{courseTitle} Guide Book</span>
                          <span className="text-xs text-gray-400 block">Syllabus PDF • 4.2 MB</span>
                        </div>
                      </div>

                      <button
                        onClick={() => simulateDownload(`${course.id}_guide.pdf`, course.id)}
                        className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {t.btnCopy.replace("Copy", "Download")}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAYMENT HISTORY */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">{t.noPaymentsYet}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50 text-gray-400 font-semibold">
                        <th className="p-4">{t.lblCourse}</th>
                        <th className="p-4">{t.lblAmount}</th>
                        <th className="p-4">{t.lblMethod}</th>
                        <th className="p-4">{t.lblDate}</th>
                        <th className="p-4">{t.lblStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-gray-700 dark:text-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                          <td className="p-4 font-bold max-w-xs truncate">{payment.courseTitle}</td>
                          <td className="p-4 font-semibold text-secondary dark:text-primary">{payment.amount} {t.currency}</td>
                          <td className="p-4 uppercase font-mono text-xs">{payment.method}</td>
                          <td className="p-4 text-xs text-gray-400">{new Date(payment.timestamp).toLocaleDateString()}</td>
                          <td className="p-4">
                            {payment.status === 'approved' ? (
                              <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                {t.statusApproved}
                              </span>
                            ) : payment.status === 'pending' ? (
                              <span className="bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                                {t.statusPending}
                              </span>
                            ) : (
                              <div className="space-y-1">
                                <span className="bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                  {t.statusRejected}
                                </span>
                                {payment.rejectionReason && (
                                  <p className="text-[10px] text-rose-500 max-w-xs mt-1 italic">
                                    Reason: {payment.rejectionReason}
                                  </p>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 shadow-sm max-w-2xl">
            <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-6">
              Edit Learning Profile
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Avatar chooser */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Select Avatar</label>
                <div className="flex flex-wrap gap-4 items-center">
                  {avatarsList.map((av, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        avatar === av ? 'border-secondary dark:border-primary scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.fieldUsername}</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-800 dark:text-white focus:border-secondary dark:focus:border-primary outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.fieldEmail}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-800 dark:text-white focus:border-secondary dark:focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.fieldPassword} (Leave blank to keep current)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-800 dark:text-white focus:border-secondary dark:focus:border-primary outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white font-display font-bold py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer"
              >
                {t.updateProfileBtn}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
