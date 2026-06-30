import { useState } from 'react';
import { Course, Language } from '../types';
import { translations } from '../translations';
import { X, Play, CheckCircle2, FileText, Download, Award, ArrowRight, PlayCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CourseDetailModalProps {
  course: Course;
  lang: Language;
  onClose: () => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function CourseDetailModal({
  course,
  lang,
  onClose,
  addToast
}: CourseDetailModalProps) {
  const t = translations[lang];
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'video' | 'resources'>('video');

  const lessons = course.lessons;
  const currentLesson = lessons[activeLessonIndex];

  const handleLessonToggle = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(id => id !== lessonId));
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
      addToast(`Lesson marked completed!`, 'success');
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else {
      addToast(`Congratulations on completing the entire course!`, 'success');
    }
  };

  // Percent calculation
  const percentComplete = Math.round((completedLessons.length / lessons.length) * 100);

  const simulateDownload = (fileName: string) => {
    addToast(`Downloading ${fileName}...`, 'info');
    setTimeout(() => {
      // Simulate real download trigger
      const link = document.createElement('a');
      link.href = 'data:application/pdf;base64,JVBERi0xLjQKJSDi48clNTRiCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNCAwIFIKPj4KPj4KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNSAwIG9iago8PAovTGVuZ3RoIDU1Cj4+CnN0cmVhbQpCVEYxIDEyIFRmCjUwIDcwMCBUZCAoVEItV0VCQVBQOiBDb3Vyc2UgUERGIE1hdGVyaWFsIClTaG93CmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTYgMDAwMDAgb制造业gCjAwMDAwMDAxMTEgMDAwMDAgbgogMDAwMDAwMDIxMiAwMDAwMCBuIAowMDAwMDAwMjgyIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzk1CiUlRU9GCg==';
      link.download = `${course.id}_syllabus_guide.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast(`Downloaded ${fileName} successfully!`, 'success');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-800"
      >
        {/* Modal Header */}
        <div className="bg-gray-50 dark:bg-gray-800 p-5 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 dark:bg-primary/10 p-2.5 rounded-xl text-secondary dark:text-primary">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">{t.learningHubTitle}</span>
              <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white truncate max-w-md">
                {lang === 'en' ? course.titleEn : course.titleOm}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Learning Player Area */}
        <div className="flex-1 overflow-y-auto grid lg:grid-cols-3">
          {/* Main Content (2 cols) */}
          <div className="lg:col-span-2 p-6 flex flex-col space-y-6 overflow-y-auto">
            {/* View Switching tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setActiveTab('video')}
                className={`py-3 px-4 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  activeTab === 'video'
                    ? 'border-secondary text-secondary dark:border-primary dark:text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Lesson Video
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`py-3 px-4 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                  activeTab === 'resources'
                    ? 'border-secondary text-secondary dark:border-primary dark:text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {t.exerciseFiles}
              </button>
            </div>

            {activeTab === 'video' ? (
              <div className="space-y-6">
                {/* Visual Video Placeholder */}
                <div className="aspect-[16/9] w-full rounded-2xl bg-gray-900 overflow-hidden relative border border-gray-800 flex flex-col justify-between p-6 shadow-inner group">
                  {/* Glowing graphic overlay */}
                  <div className="absolute inset-0 bg-radial-gradient from-secondary/5 via-transparent to-transparent pointer-events-none"></div>

                  <div className="flex justify-between items-center z-10">
                    <span className="bg-gray-900/80 backdrop-blur-md text-xs font-semibold px-3 py-1 text-gray-300 rounded-full">
                      Module {activeLessonIndex + 1}: {currentLesson.duration}
                    </span>
                    <span className="bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full">
                      HD 1080p
                    </span>
                  </div>

                  {/* Play circle trigger and title */}
                  <div className="flex flex-col items-center justify-center space-y-4 my-auto z-10">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToast(`Streaming starts! (Mock video playing)`, 'info')}
                      className="w-16 h-16 bg-secondary dark:bg-primary rounded-full flex items-center justify-center text-white dark:text-dark hover:shadow-lg hover:shadow-secondary/20 dark:hover:shadow-primary/20 transition-all cursor-pointer"
                    >
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </motion.button>
                    <div className="text-center px-4 max-w-md">
                      <h3 className="font-display font-bold text-white text-base md:text-lg">
                        {lang === 'en' ? currentLesson.titleEn : currentLesson.titleOm}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">Ethiopian Technology & Business Series by Instructor Amanuel</p>
                    </div>
                  </div>

                  {/* Bottom Controls interface bar */}
                  <div className="bg-gray-950/80 backdrop-blur-sm rounded-xl p-3 z-10 flex items-center justify-between text-xs text-gray-300">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="w-4 h-4 text-primary" />
                      <span>00:00 / {currentLesson.duration}</span>
                    </div>
                    {/* Volume and fullscreen placeholders */}
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-primary"></div>
                      </div>
                      <span className="text-gray-400 font-mono">[ 4K ]</span>
                    </div>
                  </div>
                </div>

                {/* Lesson Detail Description */}
                <div>
                  <h4 className="font-display font-bold text-gray-900 dark:text-white text-base">
                    Lesson Description
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                    In this session of the course, we deep dive into practical, step-by-step methodologies. Instructor Amanuel explains key digital concepts with realistic industry scenarios and templates. Take notes, apply the formulas, and download the associated PDF guide to review.
                  </p>
                </div>

                {/* Mark as Completed */}
                <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => handleLessonToggle(currentLesson.id)}
                    className={`inline-flex items-center gap-2 font-semibold text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                      completedLessons.includes(currentLesson.id)
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-700 border border-transparent dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${completedLessons.includes(currentLesson.id) ? 'fill-current text-emerald-500' : ''}`} />
                    {t.btnMarkComplete}
                  </button>

                  <button
                    onClick={handleNextLesson}
                    className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/95 dark:bg-primary dark:text-dark dark:hover:bg-primary/90 text-white font-bold text-sm py-2.5 px-5 rounded-xl cursor-pointer"
                  >
                    {t.btnNextLesson}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Instructor Amanuel provides high-quality PDF textbooks, templates, and spreadsheets for the course files.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-secondary dark:text-primary" />
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">Full Course Syllabus & Guide Book</span>
                        <span className="text-xs text-gray-400">PDF Guide • 4.2 MB</span>
                      </div>
                    </div>
                    <button
                      onClick={() => simulateDownload("Full_Course_Syllabus.pdf")}
                      className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-primary rounded-xl cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-secondary dark:text-primary" />
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">Instructor Special Formula Booklet</span>
                        <span className="text-xs text-gray-400">PDF Document • 1.8 MB</span>
                      </div>
                    </div>
                    <button
                      onClick={() => simulateDownload("Instructor_Formula_Booklet.pdf")}
                      className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-primary rounded-xl cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Syllabus Checklist) */}
          <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-900/60 p-6 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">
                  {t.lessonList}
                </h3>

                {/* Progress bar info */}
                <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500 dark:text-gray-400">{t.courseProgress}</span>
                    <span className="text-secondary dark:text-primary">{percentComplete}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary dark:bg-primary h-full transition-all duration-300" style={{ width: `${percentComplete}%` }}></div>
                  </div>
                  {percentComplete === 100 && (
                    <div className="text-emerald-600 dark:text-emerald-400 text-xs font-bold inline-flex items-center gap-1 mt-1">
                      <Trophy className="w-3.5 h-3.5 animate-bounce" />
                      Course Completed!
                    </div>
                  )}
                </div>
              </div>

              {/* Lesson Items */}
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {lessons.map((lesson, idx) => {
                  const isCurrent = idx === activeLessonIndex;
                  const isCompleted = completedLessons.includes(lesson.id);
                  const lessonTitle = lang === 'en' ? lesson.titleEn : lesson.titleOm;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonIndex(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-secondary/10 border-secondary/30 text-gray-900 dark:bg-primary/10 dark:border-primary/30 dark:text-white'
                          : 'bg-white border-gray-100 dark:bg-gray-800/80 dark:border-gray-800 hover:border-gray-200 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLessonToggle(lesson.id);
                        }}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 bg-white dark:bg-gray-900'
                        }`}
                      >
                        {isCompleted && (
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-400 block mb-0.5">Lesson {idx + 1}</span>
                        <p className={`text-xs font-bold leading-snug truncate ${isCurrent ? 'text-secondary dark:text-primary' : 'text-gray-800 dark:text-gray-200'}`}>
                          {lessonTitle}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{lesson.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Downward PDF materials download section */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-gray-800 dark:text-white">{t.pdfIncluded}</span>
              </div>
              <button
                onClick={() => simulateDownload("Full_Course_Guide.pdf")}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {t.downloadPDFBtn}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
