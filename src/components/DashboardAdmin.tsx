import React, { useState } from 'react';
import { Course, Language, User, Payment, Enrollment } from '../types';
import { translations } from '../translations';
import { getPayments, savePayments, getEnrollments, saveEnrollments, getUsers, saveUsers } from '../data';
import { Plus, Edit2, Trash2, Check, X, ShieldCheck, CreditCard, Users, BookOpen, DollarSign, TrendingUp, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardAdminProps {
  user: User;
  courses: Course[];
  lang: Language;
  onLogout: () => void;
  onRefreshCourses: () => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

type AdminTab = 'stats' | 'payments' | 'courses' | 'users';

export function DashboardAdmin({
  user,
  courses,
  lang,
  onLogout,
  onRefreshCourses,
  addToast
}: DashboardAdminProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [reviewingReceipt, setReviewingReceipt] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // States from local storage
  const [allPayments, setAllPayments] = useState<Payment[]>(() => getPayments());
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>(() => getEnrollments());
  const [allUsers, setAllUsers] = useState<User[]>(() => getUsers());

  // Course Form States
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleOm, setFormTitleOm] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formDescOm, setFormDescOm] = useState('');
  const [formDurationEn, setFormDurationEn] = useState('');
  const [formDurationOm, setFormDurationOm] = useState('');
  const [formLevelEn, setFormLevelEn] = useState('');
  const [formLevelOm, setFormLevelOm] = useState('');
  const [formPrice, setFormPrice] = useState(1000);
  const [formPdfIncluded, setFormPdfIncluded] = useState(true);
  const [formCategory, setFormCategory] = useState<'editing' | 'design' | 'training' | 'marketing'>('editing');

  const syncData = () => {
    setAllPayments(getPayments());
    setAllEnrollments(getEnrollments());
    setAllUsers(getUsers());
  };

  // Calculations
  const approvedPayments = allPayments.filter(p => p.status === 'approved');
  const totalRevenue = approvedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = allPayments.filter(p => p.status === 'pending');
  const totalEnrollmentsCount = allEnrollments.length;
  const totalUsersCount = allUsers.length;

  // Payments verification functions
  const handleApprovePayment = (payment: Payment) => {
    // 1. Update Payment Status to approved
    const updatedPayments = allPayments.map(p => {
      if (p.id === payment.id) {
        return { ...p, status: 'approved' as const };
      }
      return p;
    });
    savePayments(updatedPayments);

    // 2. Add an Enrollment for student to course
    const newEnrollment: Enrollment = {
      id: `enroll-${Math.random().toString(36).substring(2, 9)}`,
      userId: payment.userId,
      courseId: payment.courseId,
      dateEnrolled: new Date().toLocaleDateString()
    };
    const updatedEnrollments = [newEnrollment, ...allEnrollments];
    saveEnrollments(updatedEnrollments);

    addToast(`Approved payment for ${payment.username}! Course unlocked.`, 'success');
    setReviewingReceipt(null);
    syncData();
  };

  const handleOpenReject = (payment: Payment) => {
    setReviewingReceipt(payment);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectPayment = () => {
    if (!rejectionReason) {
      addToast('Please enter a rejection reason', 'error');
      return;
    }
    if (!reviewingReceipt) return;

    const updatedPayments = allPayments.map(p => {
      if (p.id === reviewingReceipt.id) {
        return { ...p, status: 'rejected' as const, rejectionReason };
      }
      return p;
    });
    savePayments(updatedPayments);

    addToast(`Payment verification rejected for ${reviewingReceipt.username}`, 'info');
    setShowRejectModal(false);
    setReviewingReceipt(null);
    syncData();
  };

  // Course Management functions
  const openAddCourse = () => {
    setEditingCourse(null);
    setFormTitleEn('');
    setFormTitleOm('');
    setFormDescEn('');
    setFormDescOm('');
    setFormDurationEn('');
    setFormDurationOm('');
    setFormLevelEn('');
    setFormLevelOm('');
    setFormPrice(1000);
    setFormPdfIncluded(true);
    setFormCategory('editing');
    setShowCourseForm(true);
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormTitleEn(course.titleEn);
    setFormTitleOm(course.titleOm);
    setFormDescEn(course.descEn);
    setFormDescOm(course.descOm);
    setFormDurationEn(course.durationEn);
    setFormDurationOm(course.durationOm);
    setFormLevelEn(course.levelEn);
    setFormLevelOm(course.levelOm);
    setFormPrice(course.price);
    setFormPdfIncluded(course.pdfIncluded);
    setFormCategory(course.category);
    setShowCourseForm(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn || !formTitleOm || !formDescEn || !formDescOm) {
      addToast('Please fill all required language fields', 'error');
      return;
    }

    const currentCourses = [...courses];
    if (editingCourse) {
      // Edit
      const updated = currentCourses.map(c => {
        if (c.id === editingCourse.id) {
          return {
            ...c,
            titleEn: formTitleEn,
            titleOm: formTitleOm,
            descEn: formDescEn,
            descOm: formDescOm,
            durationEn: formDurationEn || '10 Hours',
            durationOm: formDurationOm || 'Sa\'aatii 10',
            levelEn: formLevelEn || 'All Levels',
            levelOm: formLevelOm || 'Sadarkaa Hunda',
            price: Number(formPrice),
            pdfIncluded: formPdfIncluded,
            category: formCategory
          };
        }
        return c;
      });
      localStorage.setItem('tb_courses', JSON.stringify(updated));
      addToast('Course updated successfully!', 'success');
    } else {
      // Add
      const newCourse: Course = {
        id: `course-${Math.random().toString(36).substring(2, 9)}`,
        titleEn: formTitleEn,
        titleOm: formTitleOm,
        descEn: formDescEn,
        descOm: formDescOm,
        durationEn: formDurationEn || '10 Hours',
        durationOm: formDurationOm || 'Sa\'aatii 10',
        levelEn: formLevelEn || 'All Levels',
        levelOm: formLevelOm || 'Sadarkaa Hunda',
        price: Number(formPrice),
        pdfIncluded: formPdfIncluded,
        category: formCategory,
        lessons: [
          { id: `${Date.now()}-1`, titleEn: "Welcome and Setup Overview", titleOm: "Baga Nagaan Dhuftan fi Seensa", duration: "15 mins" },
          { id: `${Date.now()}-2`, titleEn: "Fundamental Theoretical Formula", titleOm: "Formula Bu'uraa Seeraa", duration: "20 mins" },
          { id: `${Date.now()}-3`, titleEn: "Step-by-Step Hands-on Workflow", titleOm: "Leenjii Harka-Harkaan Gochaa", duration: "45 mins" },
          { id: `${Date.now()}-4`, titleEn: "Course Completion Summary Guide", titleOm: "Gabaasa Xumura Koorsii Qajeelfama", duration: "30 mins" }
        ]
      };
      localStorage.setItem('tb_courses', JSON.stringify([newCourse, ...currentCourses]));
      addToast('New course created successfully!', 'success');
    }
    setShowCourseForm(false);
    onRefreshCourses();
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm(t.confirmDeleteCourse)) {
      const updated = courses.filter(c => c.id !== courseId);
      localStorage.setItem('tb_courses', JSON.stringify(updated));
      addToast('Course deleted successfully.', 'info');
      onRefreshCourses();
    }
  };

  // User Accounts functions
  const handleDeleteUser = (userId: string) => {
    if (userId === 'user-admin') {
      addToast('Cannot delete primary administrator account', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user account?')) {
      const updated = allUsers.filter(u => u.id !== userId);
      saveUsers(updated);
      addToast('User account removed.', 'info');
      syncData();
    }
  };

  const handleToggleAdmin = (targetUser: User) => {
    if (targetUser.id === 'user-admin') {
      addToast('Cannot modify primary administrator roles', 'error');
      return;
    }
    const newRole = targetUser.role === 'admin' ? 'student' as const : 'admin' as const;
    const updated = allUsers.map(u => {
      if (u.id === targetUser.id) {
        return { ...u, role: newRole };
      }
      return u;
    });
    saveUsers(updated);
    addToast(`Updated ${targetUser.username} role to ${newRole}`, 'success');
    syncData();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans">
      {/* Top Banner admin segment */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-16 h-16 rounded-full border-4 border-amber-400 overflow-hidden shadow-md bg-slate-800 flex items-center justify-center">
            <span className="font-display font-bold text-xl text-amber-400">A</span>
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                Instructor Control Panel
              </h1>
              <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Owner Mode ({user.username})
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Welcome back, Amanuel. Manage your Ethiopian student registrations, check receipts, and edit courses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={syncData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
            title="Reload Database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-lg shadow-red-500/10"
          >
            {t.logout}
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 py-3 px-5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'stats'
              ? 'border-secondary text-secondary dark:border-primary dark:text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          {t.tabCourseStats}
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
          {t.tabReviewPayments}
          {pendingPayments.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {pendingPayments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 py-3 px-5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'courses'
              ? 'border-secondary text-secondary dark:border-primary dark:text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {t.tabManageCourses}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 py-3 px-5 text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'users'
              ? 'border-secondary text-secondary dark:border-primary dark:text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Users className="w-4 h-4" />
          {t.tabManageUsers}
        </button>
      </div>

      {/* SUB-VIEW CONTENTS */}
      <div>
        {/* VIEW 1: STATS & ANALYTICS */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 shadow-sm">
                <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">{t.adminStatRevenue}</span>
                  <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-1">{totalRevenue} ETB</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 shadow-sm">
                <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">{t.adminStatEnrollments}</span>
                  <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-1">{totalEnrollmentsCount}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 shadow-sm">
                <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">{t.adminStatPending}</span>
                  <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-1">{pendingPayments.length}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 shadow-sm">
                <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-500">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">{t.adminStatTotalUsers}</span>
                  <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-1">{totalUsersCount}</span>
                </div>
              </div>
            </div>

            {/* Visual Custom Chart (Bento Popularity Bars) */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                    Course Market Share & Revenue Metrics
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Based on approved Telebirr and CBE transaction files.</p>
                </div>
                <span className="bg-secondary/10 dark:bg-primary/10 text-secondary dark:text-primary text-[10px] font-bold py-1 px-2.5 rounded-full uppercase">
                  Realtime DB
                </span>
              </div>

              <div className="space-y-6">
                {courses.map((course) => {
                  const courseTitle = lang === 'en' ? course.titleEn : course.titleOm;
                  const courseEnrollments = allEnrollments.filter(e => e.courseId === course.id);
                  const courseEarnings = approvedPayments.filter(p => p.courseId === course.id).reduce((sum, p) => sum + p.amount, 0);

                  // Calculate simple relative progress bar percentage (relative to max possible enrollments or fixed 10 bar)
                  const relativePercentage = Math.min((courseEnrollments.length / 5) * 100, 100);

                  return (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between items-center flex-wrap gap-2 text-sm">
                        <span className="font-bold text-gray-800 dark:text-gray-200">{courseTitle}</span>
                        <div className="flex gap-4 font-mono text-xs">
                          <span className="text-gray-500"><b className="text-gray-800 dark:text-gray-200">{courseEnrollments.length}</b> students</span>
                          <span className="text-emerald-500 font-bold">{courseEarnings} ETB</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-secondary dark:bg-primary h-full transition-all duration-300"
                          style={{ width: `${relativePercentage || 10}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: VERIFY PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">
              Pending Receipts Submissions ({pendingPayments.length})
            </h3>

            {pendingPayments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                <ShieldCheck className="w-12 h-12 text-emerald-500/30 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No pending payments for review! Excellent work.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {pendingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="p-5 md:p-6 space-y-4">
                      {/* Submitting user info */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Student account</span>
                          <span className="text-base font-bold text-gray-900 dark:text-white block mt-0.5">@{payment.username}</span>
                        </div>
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {payment.method} transfer
                        </span>
                      </div>

                      <div className="border-t border-b border-gray-100 dark:border-gray-700/50 py-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Enrolling Course:</span>
                          <span className="font-bold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{payment.courseTitle}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Total Price:</span>
                          <span className="font-bold text-secondary dark:text-primary">{payment.amount} ETB</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Submitted:</span>
                          <span className="text-gray-500">{new Date(payment.timestamp).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Receipt Screenshot Viewer Thumbnail */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-gray-400 block">{t.lblScreenshot}</span>
                        <div
                          onClick={() => setReviewingReceipt(payment)}
                          className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative group cursor-pointer"
                        >
                          <img src={payment.screenshotUrl} alt="Receipt Screenshot" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold text-white bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl inline-flex items-center gap-1">
                              <ExternalLink className="w-3.5 h-3.5" /> Zoom Receipt Image
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="p-5 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-850 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleOpenReject(payment)}
                        className="w-full border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        {t.btnRejectPayment}
                      </button>
                      <button
                        onClick={() => handleApprovePayment(payment)}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                      >
                        {t.btnApprovePayment}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: MANAGE COURSES (CRUD) */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">
                Courses Library Database
              </h3>

              <button
                onClick={openAddCourse}
                className="bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white font-bold text-xs py-3 px-5 rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                {t.btnAddNewCourse}
              </button>
            </div>

            {/* Courses Matrix table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50 text-gray-400 font-semibold">
                      <th className="p-4">{t.lblCourse} (English / Afaan Oromoo)</th>
                      <th className="p-4">{t.lblCategory}</th>
                      <th className="p-4">{t.lblAmount}</th>
                      <th className="p-4">PDF?</th>
                      <th className="p-4">{t.lblAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-gray-700 dark:text-gray-200">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <td className="p-4 max-w-xs md:max-w-md">
                          <div className="space-y-0.5">
                            <span className="font-bold block truncate text-gray-900 dark:text-white">{course.titleEn}</span>
                            <span className="text-xs text-gray-400 block truncate">{course.titleOm}</span>
                          </div>
                        </td>
                        <td className="p-4 uppercase font-mono text-xs text-gray-500">{course.category}</td>
                        <td className="p-4 font-bold text-secondary dark:text-primary">{course.price} ETB</td>
                        <td className="p-4">
                          {course.pdfIncluded ? (
                            <span className="text-emerald-500 text-xs font-bold uppercase">Yes</span>
                          ) : (
                            <span className="text-gray-400 text-xs font-bold uppercase">No</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditCourse(course)}
                              className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-primary rounded-lg cursor-pointer"
                              title="Edit Course Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 bg-gray-100 dark:bg-gray-800 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                              title="Delete Course"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: USERS LIST */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">
              Registered Student Accounts ({allUsers.length})
            </h3>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50 text-gray-400 font-semibold">
                      <th className="p-4">{t.fieldUsername}</th>
                      <th className="p-4">{t.fieldEmail}</th>
                      <th className="p-4">{t.profileRole}</th>
                      <th className="p-4">{t.lblAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-gray-700 dark:text-gray-200">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <img src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">@{u.username}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-xs">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {u.id !== 'user-admin' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleAdmin(u)}
                                className="text-xs font-bold border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-purple-500 hover:bg-purple-500/5 dark:text-gray-400 px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                Toggle Role
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 bg-gray-50 dark:bg-gray-800 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                                title="Remove User Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL A: SCREENSHOT VIEWING & DETAILED REVIEW */}
      <AnimatePresence>
        {reviewingReceipt && !showRejectModal && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800"
            >
              <div className="bg-gray-50 dark:bg-gray-800 p-5 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">Receipt Verification</span>
                  <h4 className="font-display font-bold text-gray-900 dark:text-white mt-0.5">@{reviewingReceipt.username}'s Uploaded Image</h4>
                </div>
                <button
                  onClick={() => setReviewingReceipt(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-gray-100 dark:bg-gray-950 flex items-center justify-center min-h-[300px] max-h-[500px] overflow-y-auto">
                <img
                  src={reviewingReceipt.screenshotUrl}
                  alt="Full receipt"
                  className="max-w-full max-h-[400px] rounded-xl object-contain shadow-lg"
                />
              </div>

              <div className="p-5 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-4 justify-between items-center">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  Total Paid: <span className="text-secondary dark:text-primary">{reviewingReceipt.amount} ETB</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleOpenReject(reviewingReceipt)}
                    className="border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer"
                  >
                    {t.btnRejectPayment}
                  </button>
                  <button
                    onClick={() => handleApprovePayment(reviewingReceipt)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {t.btnApprovePayment}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL B: REJECTION REASON SPECIFICATION */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-4"
            >
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {t.rejectModalTitle}
              </h3>

              <div className="space-y-1.5">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={t.rejectReasonPlaceholder}
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none focus:border-rose-500/40"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setReviewingReceipt(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  {t.btnCancel}
                </button>
                <button
                  onClick={handleRejectPayment}
                  className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  {t.rejectSubmitBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL C: COURSE ADD / EDIT FORM (DRAWER OVERLAY) */}
      <AnimatePresence>
        {showCourseForm && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800 my-8"
            >
              <form onSubmit={handleSaveCourse}>
                <div className="bg-gray-50 dark:bg-gray-800 p-5 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                    {editingCourse ? t.editCourseTitle : t.addCourseTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowCourseForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 rounded-full cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Category & Price */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.lblCategory}</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none"
                      >
                        <option value="editing">Photo Editing</option>
                        <option value="design">Logo Design</option>
                        <option value="training">Contact Center</option>
                        <option value="marketing">Social Media Marketing</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.lblPrice}</label>
                      <input
                        type="number"
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Title (English) / Title (Oromo) */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.lblTitleEn}</label>
                      <input
                        type="text"
                        value={formTitleEn}
                        onChange={(e) => setFormTitleEn(e.target.value)}
                        placeholder="E.g., Adobe Photoshop Masterclass"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none focus:border-secondary"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.lblTitleOm}</label>
                      <input
                        type="text"
                        value={formTitleOm}
                        onChange={(e) => setFormTitleOm(e.target.value)}
                        placeholder="Fkn., Leenjii Photoshop Qabatamaa"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none focus:border-secondary"
                        required
                      />
                    </div>
                  </div>

                  {/* Description (English) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.lblDescEn}</label>
                    <textarea
                      value={formDescEn}
                      onChange={(e) => setFormDescEn(e.target.value)}
                      rows={3}
                      placeholder="Write premium description in English..."
                      className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none focus:border-secondary"
                      required
                    />
                  </div>

                  {/* Description (Oromo) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.lblDescOm}</label>
                    <textarea
                      value={formDescOm}
                      onChange={(e) => setFormDescOm(e.target.value)}
                      rows={3}
                      placeholder="Ibsa koorsii Afaan Oromootiin barreessi..."
                      className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none focus:border-secondary"
                      required
                    />
                  </div>

                  {/* Duration En / Om */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.lblDurationEn}</label>
                      <input
                        type="text"
                        value={formDurationEn}
                        onChange={(e) => setFormDurationEn(e.target.value)}
                        placeholder="E.g., 8 Hours of Video lessons"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.lblDurationOm}</label>
                      <input
                        type="text"
                        value={formDurationOm}
                        onChange={(e) => setFormDurationOm(e.target.value)}
                        placeholder="Fkn., Viidiyoo leenjii Sa'aatii 8"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Level En / Om */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.lblLevelEn}</label>
                      <input
                        type="text"
                        value={formLevelEn}
                        onChange={(e) => setFormLevelEn(e.target.value)}
                        placeholder="E.g., Beginner to Advanced"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.lblLevelOm}</label>
                      <input
                        type="text"
                        value={formLevelOm}
                        onChange={(e) => setFormLevelOm(e.target.value)}
                        placeholder="Fkn., Eegaltuu irraa jalqabee"
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-800 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* PDF included toggle checkbox */}
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <input
                      type="checkbox"
                      id="formPdfIncluded"
                      checked={formPdfIncluded}
                      onChange={(e) => setFormPdfIncluded(e.target.checked)}
                      className="w-4 h-4 text-secondary dark:text-primary rounded focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="formPdfIncluded" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                      {t.lblPdfIncluded} (Allows student to download study syllabus directly)
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-5 border-t border-gray-100 dark:border-gray-700/50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCourseForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    {t.btnCancel}
                  </button>
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-md"
                  >
                    {t.btnSaveCourse}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
