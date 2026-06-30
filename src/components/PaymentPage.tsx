import React, { useState, useRef } from 'react';
import { Course, Language, Payment } from '../types';
import { translations } from '../translations';
import { Smartphone, Building2, Copy, Check, Upload, ArrowLeft, ShieldAlert, Sparkles, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { getPayments, savePayments } from '../data';

interface PaymentPageProps {
  course: Course;
  lang: Language;
  userId: string;
  username: string;
  onBack: () => void;
  onPaymentSuccess: () => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function PaymentPage({
  course,
  lang,
  userId,
  username,
  onBack,
  onPaymentSuccess,
  addToast
}: PaymentPageProps) {
  const t = translations[lang];
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants
  const telebirrPhone = "0967145146";
  const cbeAccount = "1000755134701";
  const instructorName = "Amanuel";

  const handleCopy = (text: string, type: 'phone' | 'account') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    addToast(`${type === 'phone' ? 'Telebirr Phone' : 'CBE Account'} copied!`, 'success');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (PNG, JPG, WEBP)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('File size should be less than 5MB', 'error');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshot(reader.result as string);
      setIsUploading(false);
      addToast('Screenshot uploaded successfully!', 'success');
    };
    reader.onerror = () => {
      setIsUploading(false);
      addToast('Error reading file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Dynamic Auto-receipt generator for quick testing
  const generateMockReceipt = () => {
    setIsUploading(true);
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw background
        const grad = ctx.createLinearGradient(0, 0, 400, 400);
        if (paymentMethod === 'telebirr') {
          grad.addColorStop(0, '#1d4ed8');
          grad.addColorStop(1, '#1e3a8a');
        } else {
          grad.addColorStop(0, '#701a75');
          grad.addColorStop(1, '#4a044e');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 400);

        // Header
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(paymentMethod === 'telebirr' ? 'telebirr Transfer' : 'CBE Mobile Banking', 30, 50);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('TRANSACTION SUCCESSFUL', 30, 80);

        // Divider
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.moveTo(30, 100);
        ctx.lineTo(370, 100);
        ctx.stroke();

        // Details
        ctx.fillStyle = '#f3f4f6';
        ctx.font = '14px monospace';
        ctx.fillText(`Ref: TXN${Math.floor(Math.random() * 900000000) + 100000000}`, 30, 130);
        ctx.fillText(`Date: ${new Date().toLocaleString()}`, 30, 160);
        ctx.fillText(`To: ${instructorName}`, 30, 190);
        ctx.fillText(`Acc/Phone: ${paymentMethod === 'telebirr' ? telebirrPhone : cbeAccount}`, 30, 220);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`Course: ${course.titleEn.substring(0, 25)}...`, 30, 260);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`Amount: ${course.price} ETB`, 30, 310);

        // Stamp
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(320, 320, 45, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('VERIFIED', 290, 315);
        ctx.fillText('CASH IN', 292, 332);

        setScreenshot(canvas.toDataURL());
        setIsUploading(false);
        addToast('High-fidelity simulated receipt generated!', 'success');
      }
    }, 600);
  };

  const handleSubmit = () => {
    if (!screenshot) {
      addToast('Please upload or generate a payment receipt screenshot.', 'error');
      return;
    }

    const newPayment: Payment = {
      id: `pay-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      username,
      courseId: course.id,
      courseTitle: lang === 'en' ? course.titleEn : course.titleOm,
      amount: course.price,
      method: paymentMethod,
      screenshotUrl: screenshot,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    const allPayments = getPayments();
    // Prepend new payment
    savePayments([newPayment, ...allPayments]);
    onPaymentSuccess();
  };

  const courseTitle = lang === 'en' ? course.titleEn : course.titleOm;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
      {/* Header back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-secondary dark:hover:text-primary transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.btnBackToLogin.replace("Login", t.navCourses)}
      </button>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left Side: Order Review */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-4">
              {t.navDashboard.replace("Dashboard", "Enrollment Details")}
            </h2>
            <div className="space-y-4">
              <div className="aspect-[16/9] w-full rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700 p-2 text-center text-xs">
                <div>
                  <FileText className="w-8 h-8 mx-auto text-secondary dark:text-primary mb-2" />
                  <span className="font-semibold text-gray-700 dark:text-gray-200 block truncate">{courseTitle}</span>
                  <span className="text-gray-500 block mt-1">{course.price} {t.currency}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{course.price} {t.currency}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>VAT (0%)</span>
                  <span>0.00 {t.currency}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700/50 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                  <span>Total Amount</span>
                  <span className="text-secondary dark:text-primary">{course.price} {t.currency}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-5 text-sm text-amber-800 dark:text-amber-300">
            <div className="flex gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Manual Verification</h4>
                <p className="leading-relaxed">
                  Instructor Amanuel manually verifies transfers to secure and protect digital resources. Transfers are processed quickly, usually within 1-2 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Step Workflow & Upload */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 shadow-sm space-y-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                {t.paymentTitle}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                {t.paymentSubtitle}
              </p>
            </div>

            {/* STEP 1: SELECT METHOD */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase letter-spacing-1">
                {t.paymentStep1}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('telebirr')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    paymentMethod === 'telebirr'
                      ? 'border-secondary bg-blue-50/10 text-secondary dark:border-primary dark:bg-amber-50/5 dark:text-primary'
                      : 'border-gray-100 bg-gray-50/30 dark:border-gray-700 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-sm font-bold">{t.payMethodTelebirr}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cbe')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    paymentMethod === 'cbe'
                      ? 'border-secondary bg-blue-50/10 text-secondary dark:border-primary dark:bg-amber-50/5 dark:text-primary'
                      : 'border-gray-100 bg-gray-50/30 dark:border-gray-700 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <Building2 className="w-6 h-6" />
                  <span className="text-sm font-bold">{t.payMethodCBE}</span>
                </button>
              </div>
            </div>

            {/* STEP 2: DETAILS */}
            <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase letter-spacing-1">
                {t.paymentStep2}
              </h3>
              {paymentMethod === 'telebirr' ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.payInstructionTelebirr}
                  </p>
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-xs text-gray-400 block">{t.telebirrPhoneNum}</span>
                      <span className="font-mono text-lg font-bold text-gray-800 dark:text-white">{telebirrPhone}</span>
                      <span className="text-xs text-gray-500 block">Name: {instructorName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(telebirrPhone, 'phone')}
                      className="p-2 text-gray-500 hover:text-secondary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      {copiedText === 'phone' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.payInstructionCBE}
                  </p>
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-xs text-gray-400 block">{t.cbeAccountNum}</span>
                      <span className="font-mono text-lg font-bold text-gray-800 dark:text-white">{cbeAccount}</span>
                      <span className="text-xs text-gray-500 block">CBE Branch: Harar, Kebele 02</span>
                      <span className="text-xs text-gray-500 block">Holder Name: {instructorName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(cbeAccount, 'account')}
                      className="p-2 text-gray-500 hover:text-secondary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      {copiedText === 'account' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3 & 4: UPLOAD & SUBMIT */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase letter-spacing-1">
                  {t.paymentStep3} & {t.paymentStep4.replace("4.", "")}
                </h3>
                {/* Auto receipt helper button */}
                <button
                  type="button"
                  onClick={generateMockReceipt}
                  className="text-xs font-semibold text-secondary dark:text-primary bg-secondary/10 dark:bg-primary/10 hover:bg-secondary/20 dark:hover:bg-primary/20 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Simulate Receipt
                </button>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-secondary bg-secondary/5 dark:border-primary dark:bg-primary/5'
                    : screenshot
                    ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-gray-50/10'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="py-4 space-y-3">
                    <div className="w-8 h-8 border-4 border-secondary dark:border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Processing receipt image...</p>
                  </div>
                ) : screenshot ? (
                  <div className="space-y-4">
                    <div className="relative max-w-xs mx-auto aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                      <img src={screenshot} alt="Receipt Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-white bg-gray-900/80 px-3 py-1.5 rounded-full">Change Image</span>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                      <Check className="w-4 h-4" /> Screenshot ready for review
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 py-2">
                    <div className="bg-gray-100 dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-gray-500">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{t.dragDropArea}</p>
                      <p className="text-xs text-gray-400 mt-1">{t.supportedFormats}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!screenshot || isUploading}
              className={`w-full font-display font-bold py-4 px-6 rounded-xl transition-all shadow-lg ${
                screenshot && !isUploading
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10 cursor-pointer hover:scale-[1.01]'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none'
              }`}
            >
              {t.btnSubmitPayment}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
